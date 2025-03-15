import { LoadingOutlined, SmileOutlined } from '@ant-design/icons';
import { notification, Pagination, Spin, Table, Input, Button } from 'antd';
import { useCallback } from 'react';
import type { TableColumnsType } from 'antd';
import { createStyles } from 'antd-style';
import Text from '../../components/TextComponent/Text';
import { fonts } from '../../constants/fonts';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { NhaTro, useRentals } from '../../hooks/rentalHook';
import { addNhaTroToSaveList, removeFavoriteLocally } from '../../store/slices/favoriteSlice';
import { setCurrentPagination } from '../../store/slices/pageSlice';
import { COLORS } from '../../constants/colors';
const { Search } = Input;

const handleUpdate = (record: NhaTro) => {
    console.log("Cập nhật nhà trọ:", record);
    // Thực hiện logic cập nhật, có thể mở modal hoặc điều hướng đến trang chỉnh sửa
};

const handleDelete = (id: number) => {
    console.log("Xóa nhà trọ có ID:", id);
    // Thực hiện logic xóa, có thể gọi API để xóa
};

const columns: TableColumnsType<NhaTro> = [
    {
        title: "Hành động",
        key: "action",
        width: 200,
        render: (_, record) => (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                    style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}
                    onClick={() => handleUpdate(record)}
                >
                    Cập nhật
                </Button>
                <Button
                    style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}
                    onClick={() => handleDelete(record.id)}
                >
                    Xóa
                </Button>
            </div>
        )
    },
    {
        title: "Mã số",
        dataIndex: "id",
        width: 100
    },
    {
        title: "Tiêu đề",
        dataIndex: "title",
        width: 150
    },
    {
        title: "Địa chỉ",
        dataIndex: "address",
        width: 300,
    },
    {
        title: "Mô tả",
        dataIndex: "description",
        width: 350,
    },
    {
        title: "Giá",
        dataIndex: "price",
        width: 150,
    },
    {
        title: "Diện tích",
        dataIndex: "area",
        width: 100,
    },
    {
        title: "Số phòng ngủ",
        dataIndex: "bedRoomCount",
        width: 150,
    },
    {
        title: "Số phòng vệ sinh",
        dataIndex: "bathRoom",
        width: 300,
    },
    {
        title: "Ngày đăng",
        dataIndex: "postedDate",
        width: 100,
    },
    {
        title: "Ngày hết hạn",
        dataIndex: "expiredDate",
        width: 100,
    },
    {
        title: "Địa chỉ",
        dataIndex: "address",
        width: 300,
    },
    {
        title: "Nội thất",
        dataIndex: "furniture",
        width: 100,
    }
]

const RentalPostManagementPage = () => {

    const { currentPagination, currentPageSize } = useAppSelector((state) => state.page);
    const { user } = useAppSelector((state) => state.auth)
    const { savedRentalData } = useAppSelector((state) => state.favorite);
    const dispatch = useAppDispatch()
    const [api, contextHolder] = notification.useNotification();

    const { data: rentals, error, isLoading } = useRentals({
        page: currentPagination,
        pageSize: currentPageSize,
        userId: user?.id
    });

    const openNotification = (message: string) => {
        api.open({
            message: message,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
    };

    const handleCopyPhoneNumber = useCallback((phoneNumber: string) => {
        navigator.clipboard.writeText(phoneNumber)
        alert("Đã sao chép số điện thoại: " + phoneNumber);
    }, [])

    const handleRemoveNhaTroFromSaveList = useCallback((nhaTroId: number) => {
        dispatch(removeFavoriteLocally(nhaTroId));
    }, [dispatch]);

    const handleChangePagination = useCallback((number: number, pageSize: number) => {
        dispatch(setCurrentPagination({ currentPagination: number, currentPageSize: pageSize }));
    }, [dispatch]);

    const handleAddNhaTroToSaveList = useCallback((nhaTroId: number) => {
        // dispatch(addFavoriteLocally(nhaTroId));
        dispatch(addNhaTroToSaveList({ id: nhaTroId }));
        openNotification("Đã lưu thông tin nhà trọ")
    }, [dispatch]);

    if (error) {
        console.log("Lỗi")
    }

    return (
        <>
            {contextHolder}
            <Text text="Danh sách tin đã đăng" fontFamily={fonts.bold} fontSize={24} />
            <Search placeholder="Nhập id" enterButton="Tìm kiếm" size="large" loading={false} style={{ marginBottom: 8 }} />
            {
                isLoading ?
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Spin style={{ color: COLORS.DARK_SLATE }} indicator={<LoadingOutlined spin />} size='large' />
                    </div>
                    :
                    <Table<NhaTro>
                        columns={columns}
                        dataSource={rentals?.data}
                        // pagination={{ pageSize: 20 }}
                        scroll={{ x: 1000, y: 480 }}
                        bordered
                    />

            }
        </>
    )
}

export default RentalPostManagementPage