import { DeleteOutlined, EditOutlined, LoadingOutlined, SmileOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, notification, Pagination, Popconfirm, Space, Spin, Table, Typography, Modal, Form, Upload, Tooltip, Badge, BadgeProps } from 'antd';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { NhaTro, useRentals, useRentalsByUserId } from '../../hooks/rentalHook';
import { setCurrentPagination } from '../../store/slices/pageSlice';
import api from '../../services/api';

const { Search } = Input;
const { Title } = Typography;

const STATUS_LABELS = {
    0: { text: 'Chưa duyệt', color: 'warning' },
    1: { text: 'Đã duyệt', color: 'success' },
    2: { text: 'Từ chối', color: 'error' }
};

const RentalPostManagementPage = () => {
    const { currentPagination, currentPageSize } = useAppSelector((state) => state.page);
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [notificationApi, contextHolder] = notification.useNotification();
    const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
    const { data: rentals, error, isLoading } = useRentalsByUserId({
        page: currentPagination,
        pageSize: currentPageSize,
        userId: user?.id,
    });

    // State quản lý modal, form và ảnh
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRental, setSelectedRental] = useState(null);
    const [form] = Form.useForm();
    const [imageUrls, setImageUrls] = useState([]);

    const openNotification = (message) => {
        notificationApi.open({
            message: message,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
    };

    // Mở modal chỉnh sửa
    const handleUpdate = (record) => {
        setSelectedRental(record);
        form.setFieldsValue(record); // Điền dữ liệu vào form
        setImageUrls(record.imageUrls); // Lưu ảnh hiện tại
        setIsModalOpen(true);
    };

    // Xử lý tải lên ảnh
    const handleUploadChange = ({ file }) => {
        if (file.status === "done") {
            const newImageUrl = URL.createObjectURL(file.originFileObj);
            setImageUrls(prevUrls => [...prevUrls, newImageUrl]); // Thêm ảnh mới vào danh sách
        }
    };

    // Xử lý xóa ảnh
    const handleDeleteImage = (index) => {
        setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index)); // Xóa ảnh khỏi danh sách
    };

    // Xử lý cập nhật
    const handleSave = async () => {
        form.validateFields()
            .then(async (values) => {
                const response = await api.put('/NhaTro', {
                    ...values,
                    imageUrls
                })

                if (response.data.isSuccess) {
                    console.log(response.data);
                }

                setIsModalOpen(false);
                openNotification("Cập nhật thành công!");
            })
            .catch(errorInfo => {
                console.log("Lỗi cập nhật:", errorInfo);
            });
    };

    const handleDelete = (id) => {
        console.log('Xóa nhà trọ có ID:', id);
    };

    const columns = [
        {
            title: 'Hành động',
            key: 'action',
            fixed: 'left',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} type="primary" onClick={() => handleUpdate(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button icon={<DeleteOutlined />} danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Chưa duyệt', value: 0 },
                { text: 'Đã duyệt', value: 1 },
                { text: 'Từ chối', value: 2 }
            ],
            filteredValue: filteredInfo.status || null,
            onFilter: (value: number, record: NhaTro) => record.status === value,
            render: (status: number, record: NhaTro) => (
                <Tooltip title={record.rejectionReason && `Lý do từ chối: ${record.rejectionReason}`}>
                    <Badge
                        status={STATUS_LABELS[status].color as BadgeProps['status']}
                        text={STATUS_LABELS[status].text}
                    />
                </Tooltip>
            )
        },
        { title: 'Mã số', dataIndex: 'id', width: 100 },
        { title: 'Tiêu đề', dataIndex: 'title', width: 150 },
        { title: 'Ảnh', dataIndex: 'imageUrl', width: 150, render: (_, record) => <img src={record.imageUrls[0]} alt="Ảnh" style={{ width: 80, height: 50, objectFit: 'cover' }} /> },
        { title: 'Địa chỉ', dataIndex: 'address', width: 250 },
        { title: 'Giá', dataIndex: 'price', width: 120, align: 'right' },
        { title: 'Diện tích', dataIndex: 'area', width: 120, align: 'right' },
        { title: 'Số phòng ngủ', dataIndex: 'bedRoomCount', width: 150, align: 'center' },
        { title: 'Số phòng vệ sinh', dataIndex: 'bathRoom', width: 150, align: 'center' },
        { title: 'Ngày đăng', dataIndex: 'postedDate', width: 150 },
        { title: 'Ngày hết hạn', dataIndex: 'expiredDate', width: 150 },
    ];

    const handleChangePagination = (number, pageSize) => {
        dispatch(setCurrentPagination({ currentPagination: number, currentPageSize: pageSize }));
    };

    const handleTableChange = (pagination: any, filters: any) => {
        setFilteredInfo(filters);
        // If you need to handle pagination here as well
        handleChangePagination(pagination.current, pagination.pageSize);
    };

    return (
        <>
            {contextHolder}
            <Title level={3} style={{ marginBottom: 16 }}>Quản lý bài đăng nhà trọ</Title>
            <Search placeholder="Nhập id hoặc tiêu đề" enterButton="Tìm kiếm" size="large" style={{ marginBottom: 16, maxWidth: 400 }} />

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: 50 }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={rentals?.data || []}
                    loading={isLoading}
                    rowKey="id"
                    onChange={handleTableChange}
                    pagination={{
                        current: currentPagination,
                        pageSize: currentPageSize,
                        total: rentals?.totalItems,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng số ${total} bài đăng`,
                    }}
                    scroll={{ x: 'max-content' }}
                />
            )}

            <Pagination
                style={{ marginTop: 24, textAlign: 'center' }}
                pageSize={currentPageSize}
                onChange={handleChangePagination}
                current={currentPagination}
                total={rentals?.totalItems}
            />

            {/* Modal chỉnh sửa */}
            <Modal
                title="Chỉnh sửa bài đăng"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Giá" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="area" label="Diện tích" rules={[{ required: true, message: "Vui lòng nhập diện tích!" }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="bedRoomCount" label="Số phòng ngủ">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="bathRoom" label="Số phòng vệ sinh">
                        <Input type="number" />
                    </Form.Item>
                    {/* Trường tải lên ảnh */}
                    <Form.Item label="Danh sách ảnh">
                        {
                            imageUrls.map((imageUrl, index) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block', marginRight: 8 }}>
                                    <img src={imageUrl} alt="Ảnh hiện tại" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                    <Button
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        style={{ position: 'absolute', top: 0, right: 0, color: 'red' }}
                                        onClick={() => handleDeleteImage(index)}
                                    />
                                </div>
                            ))
                        }
                    </Form.Item>
                    <Form.Item label="Tải lên ảnh mới">
                        <Upload
                            showUploadList={false}
                            beforeUpload={() => false} // Không upload ngay, chỉ lưu vào state
                            onChange={handleUploadChange}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default RentalPostManagementPage;