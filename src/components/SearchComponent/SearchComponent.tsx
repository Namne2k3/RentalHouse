import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Dropdown, Input, Radio, Slider } from 'antd';
import { ChangeEventHandler, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AddressDTO, searchRentals, searchRentalsAddress, setPriceRange } from '../../store/slices/searchSlice';
import './styles.css';

import type { AutoCompleteProps, MenuProps, RadioChangeEvent } from 'antd';
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
    const { search, addresses, priceRange } = useAppSelector((state) => state.search);
    const [priceRangeState, setPriceRangeState] = useState(priceRange);
    const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
    const [searchState, setSearchState] = useState(search);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string>('');

    const handleFilterChange = (e: RadioChangeEvent) => {
        console.log(e.target.value);

        setSelectedFilter(e.target.value);
        switch (e.target.value) {
            case "0to3":
                setPriceRangeState(() => [0, (3 * 1000000)])
                break;

            case "3to5":
                setPriceRangeState(() => [(3 * 1000000), (5 * 1000000)])
                break;

            case "5to10":
                setPriceRangeState(() => [(5 * 1000000), (10 * 1000000)])
                break;

            default:
                break;
        }
    };


    const handleSearchRental = (search: string) => {
        if (priceRangeState) {
            dispatch(setPriceRange(priceRangeState))
        }

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

    // const handlePriceRangeChange = (value: [number, number]) => {
    //     console.log(value);
    //     setPriceRange(value);
    // };


    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div
                    style={{ padding: '12px', minWidth: '300px' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div>
                        <h4>Khoảng giá (triệu)</h4>
                        <Slider
                            range
                            min={0}
                            max={10000000}
                            value={priceRangeState}
                            onChange={setPriceRangeState}
                        // marks={{
                        //     0: '0tr',
                        //     5: '5tr',
                        //     10: '10tr'
                        // }}
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <h4>Lọc nhanh</h4>
                        <Radio.Group
                            value={selectedFilter}
                            onChange={handleFilterChange}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >
                            <Radio value="0to3">Từ 1 đến 3 triệu</Radio>
                            <Radio value="3to5">Từ 3 đến 5 triệu</Radio>
                            <Radio value="5to10">Từ 5 đến 10 triệu</Radio>
                        </Radio.Group>
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
