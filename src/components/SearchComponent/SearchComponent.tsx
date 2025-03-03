import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Checkbox, Dropdown, Input, Slider } from 'antd';
import { ChangeEventHandler, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AddressDTO, searchRentals, searchRentalsAddress } from '../../store/slices/searchSlice';
import './styles.css';

import type { AutoCompleteProps, MenuProps } from 'antd';
import Text from '../TextComponent/Text';

const searchResult = (addresses: AddressDTO[]) => {
    return addresses?.map((add) => {
        return {
            value: add.id,
            label: (
                <div
                    key={add.id}
                    style={{
                        display: 'flex',
                        width: "100%",
                        justifyContent: 'space-between',
                    }}
                    // Nếu cần, có thể thêm onClick để stop propagation
                    onClick={(e) => e.stopPropagation()}
                >
                    <Text text={add.address} />
                </div>
            ),
        }
    });
}

const SearchComponent = () => {
    const dispatch = useAppDispatch();
    const { search, addresses } = useAppSelector((state) => state.search);
    const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
    const [searchState, setSearchState] = useState(search);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSearchRental = (search: string) => {
        if (search) {
            dispatch(searchRentals({ search }));
        }
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
        setSearchState(event.target.value);
        await dispatch(searchRentalsAddress({ search: event.target.value }));
        setOptions(event.target.value ? searchResult(addresses ?? []) : []);
    }

    const onSelect = (value: string) => {
        console.log(value);
    };

    const handlePriceRangeChange = (value: [number, number]) => {
        setPriceRange(value);
    };

    const handleFilterChange = (checkedValues: string[]) => {
        setSelectedFilters(checkedValues);
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div
                    style={{ padding: '12px', minWidth: '300px' }}
                    // Ngăn không cho click bên trong menu đóng dropdown
                    onClick={(e) => e.stopPropagation()}
                >
                    <div>
                        <h4>Khoảng giá (triệu)</h4>
                        <Slider
                            range
                            min={0}
                            max={10}
                            value={priceRange}
                            onChange={handlePriceRangeChange}
                            marks={{
                                0: '0tr',
                                5: '5tr',
                                10: '10tr'
                            }}
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <h4>Lọc nhanh</h4>
                        <Checkbox.Group
                            options={[
                                { label: 'Dưới 3 triệu', value: 'under3' },
                                { label: 'Từ 3-5 triệu', value: '3to5' },
                                { label: 'Trên 5 triệu', value: 'above5' },
                            ]}
                            value={selectedFilters}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', gap: '16px', flexDirection: "column" }} >
            <AutoComplete
                style={{ width: "100%" }}
                options={options}
                onSelect={onSelect}
                size="middle"
                className="custom-search-button"
            >
                <Input.Search
                    onSearch={handleSearchRental}
                    value={searchState}
                    onChange={handleChange}
                    prefix={<SearchOutlined />}
                    size="large"
                    placeholder="Tìm kiếm địa chỉ"
                    enterButton="Tìm kiếm"
                />
            </AutoComplete>
            <div style={{ display: "flex", justifyContent: "start" }}>
                <Dropdown
                    menu={{ items }}
                    trigger={['click']}
                    open={dropdownOpen}
                    onOpenChange={(flag) => setDropdownOpen(flag)}
                    placement="bottomRight"
                >
                    <Button
                        icon={<DownOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(!dropdownOpen);
                        }}
                    >
                        Lọc giá
                    </Button>
                </Dropdown>
            </div>
        </div>
    )
}

export default SearchComponent;
