import {
    Button, Space, Table, Tag, Modal, message, Input, Spin, Typography,
    notification, Tooltip, Badge, Drawer, Descriptions, Image,
    Form,
    InputNumber, Upload
} from 'antd';
import './style.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    CheckOutlined, CloseOutlined, EyeOutlined, LoadingOutlined,
    SmileOutlined, DeleteOutlined, ExclamationCircleOutlined,
    EditOutlined, UploadOutlined
} from '@ant-design/icons';

import { useState } from 'react';
import api from '../../../services/api';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setCurrentPagination } from '../../../store/slices/pageSlice';
import { searchRentals } from '../../../store/slices/searchSlice';


const { Search } = Input;
const { Title } = Typography;

interface NhaTro {
    id: number;
    title: string;
    address: string;
    price: number;
    status: 0 | 1;
    postedDate: string;
    fullName: string;
    email: string;
    description?: string;
    rejectionReason?: string;
    approvedDate?: string;
    imageUrls: string[];
}

const NhaTroManagementPage = () => {
    const { currentPagination, currentPageSize } = useAppSelector((state) => state.page);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const [rejectReason, setRejectReason] = useState<string>('');
    const [notificationApi, contextHolder] = notification.useNotification();
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedNhaTro, setSelectedNhaTro] = useState<NhaTro | null>(null);
    const [editingImages, setEditingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const { search } = useAppSelector((state) => state.search)
    const [editForm] = Form.useForm();
    const [modal, contextHolerModal] = Modal.useModal();
    const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});

    const { data: nhaTros, isLoading } = useQuery({
        queryKey: ['nhaTros', currentPagination, currentPageSize],
        queryFn: async () => {
            const response = await api.get('/NhaTro/GetAllNhaTros', {
                params: {
                    page: currentPagination,
                    pageSize: currentPageSize,
                    title: search
                }
            });
            return response.data;
        }
    });

    const handleTableChange = (pagination: any, filters: any) => {
        setFilteredInfo(filters);
        handleChangePagination(pagination.current, pagination.pageSize);
    };

    // View detail handler
    const showDetail = (record: NhaTro) => {
        setSelectedNhaTro(record);
        setDetailVisible(true);
    };

    const updateNhaTro = useMutation({
        mutationFn: async (data: Partial<NhaTro>) => {
            const formData = new FormData();

            // Append basic data
            formData.append('nhaTroData', JSON.stringify(data));

            // Append existing images that weren't deleted
            formData.append('existingImages', JSON.stringify(editingImages));

            // Append new images
            newImages.forEach(file => {
                formData.append('newImages', file);
            });

            return api.put(`/NhaTro/${data.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nhaTros'] });
            message.success('Cập nhật thành công');
            setIsEditModalVisible(false);
            setNewImages([]);
            setEditingImages([]);
        },
        onError: () => {
            message.error('Có lỗi xảy ra khi cập nhật');
        }
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status, reason }: { id: number; status: number; reason?: string }) => {
            return await api.put(`/NhaTro/updateStatus/${id}`, {
                reason,
                status
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nhaTros'] });
            notificationApi.open({
                message: 'Cập nhật trạng thái thành công',
                icon: <SmileOutlined style={{ color: '#108ee9' }} />
            });
        },
        onError: () => message.error('Có lỗi xảy ra khi cập nhật trạng thái')
    });

    const handleChangePagination = (page: number, pageSize: number) => {
        dispatch(setCurrentPagination({ currentPagination: page, currentPageSize: pageSize }));
    };

    const handleApprove = (id: number) => {
        modal.confirm({
            title: 'Xác nhận duyệt',
            content: 'Bạn có chắc chắn muốn duyệt bài đăng này?',
            onOk: () => updateStatus.mutate({ id, status: 1 })
        });
    };

    const handleEdit = (record: NhaTro) => {
        editForm.setFieldsValue({
            id: record.id,
            title: record.title,
            address: record.address,
            price: record.price,
            description: record.description,
        });
        setEditingImages(record.imageUrls);
        setIsEditModalVisible(true);
    };

    const handleUploadChange = ({ file }: { file: File }) => {
        if (file) {
            setNewImages(prev => [...prev, file]);
            const imageUrl = URL.createObjectURL(file);
            setEditingImages(prev => [...prev, imageUrl]);
        }
    };

    const handleDeleteImage = (index: number) => {
        setEditingImages(prev => prev.filter((_, i) => i !== index));
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleReject = (id: number) => {
        modal.confirm({
            title: 'Từ chối bài đăng',
            content: (
                <div>
                    <p>Vui lòng nhập lý do từ chối:</p>
                    <Input.TextArea
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </div>
            ),
            onOk: () => {
                if (!rejectReason) {
                    message.error('Vui lòng nhập lý do từ chối');
                    return;
                }
                updateStatus.mutate({
                    id,
                    status: 0,
                    reason: rejectReason
                });
                setRejectReason('');
            }
        });
    };

    const handleDelete = (id: number) => {
        modal.confirm({
            title: 'Xác nhận xóa',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await api.delete(`/NhaTro/${id}`);
                    queryClient.invalidateQueries({ queryKey: ['nhaTros'] });
                    message.success('Xóa bài đăng thành công');
                } catch (error) {
                    message.error('Có lỗi xảy ra khi xóa bài đăng' + error);
                }
            },
        });
    };

    const columns = [
        {
            title: 'Thao tác',
            key: 'action',
            width: 200,
            render: (_: unknown, record: NhaTro) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="primary"
                            ghost
                            icon={<EyeOutlined />}
                            onClick={() => showDetail(record)}
                        />
                    </Tooltip>

                    {record.status === 0 && (
                        <>
                            <Tooltip title="Duyệt bài">
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    onClick={() => handleApprove(record.id)}
                                />
                            </Tooltip>
                            <Tooltip title="Từ chối">
                                <Button
                                    danger
                                    icon={<CloseOutlined />}
                                    onClick={() => handleReject(record.id)}
                                />
                            </Tooltip>
                        </>
                    )}

                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>

                    {/* <Tooltip title="Xóa">
                        <Button
                            danger
                            type="primary"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip> */}
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: number, record: NhaTro) => {
                const colors: Record<number, string> = {
                    0: 'warning',
                    1: 'success',
                    2: 'error'
                };
                const labels: Record<number, string> = {
                    0: 'Chưa duyệt',
                    1: 'Đã duyệt',
                    2: 'Đã từ chối'
                };
                return (
                    <Tooltip title={record.rejectionReason && `Lý do từ chối: ${record.rejectionReason}`}>
                        <Tag color={colors[status]}>{labels[status]}</Tag>
                        {/* <Badge status={colors[status]} text={labels[status]} /> */}
                    </Tooltip>
                );
            },
            filters: [
                { text: 'Chưa duyệt', value: 0 },
                { text: 'Đã duyệt', value: 1 },
                { text: 'Từ chối', value: 2 },
            ],
            onFilter: (value: number, record: NhaTro) => record.status === value,
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'postedDate',
            key: 'postedDate',
            render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            filterMode: 'menu',
            filteredValue: filteredInfo.id || null,
            filterSearch: true,
            filters: nhaTros?.data?.map(item => ({
                text: item.id,
                value: item.id,
            })) || [],
            onFilter: (value: number, record: NhaTro) => record.id === value,
            sorter: (a: NhaTro, b: NhaTro) => a.id - b.id,
        },
        {
            title: 'Ảnh',
            key: 'image',
            width: 150,
            render: (_: unknown, record: NhaTro) => (
                <img
                    src={record.imageUrls[0]}
                    alt="Ảnh"
                    style={{ width: 80, height: 50, objectFit: 'cover' }}
                />
            ),
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => price?.toLocaleString('vi-VN') + ' VNĐ',
        },
        {
            title: 'Người đăng',
            dataIndex: 'user',
            key: 'user',
            render: (_: unknown, record: NhaTro) => (
                <div>
                    <div>{record.fullName}</div>
                    <div>{record.email}</div>
                </div>
            ),
        }
    ];

    return (
        <>
            {contextHolder}
            {contextHolerModal}
            <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={3}>Quản lý nhà trọ</Title>
                    {/* <Search
                        placeholder="Tìm kiếm theo tiêu đề"
                        enterButton
                        style={{ width: 300 }}
                        onClick={() => {
                            dispatch(searchRentals({ search }))
                            queryClient.invalidateQueries({ queryKey: ['nhaTros'] });
                        }}
                    /> */}
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: 50 }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
                    </div>
                ) : (
                    <>
                        <Table
                            columns={columns}
                            dataSource={nhaTros?.data}
                            loading={isLoading}
                            rowKey="id"
                            onChange={handleTableChange}
                            pagination={{
                                current: currentPagination,
                                pageSize: currentPageSize,
                                total: nhaTros?.totalItems,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng số ${total} bài đăng`,
                            }}
                            scroll={{ x: 'max-content' }}
                            bordered
                        />
                        <Drawer
                            title="Chi tiết bài đăng"
                            placement="right"
                            width={640}
                            onClose={() => setDetailVisible(false)}
                            open={detailVisible}
                        >
                            {selectedNhaTro && (
                                <>
                                    <Descriptions bordered column={1}>
                                        <Descriptions.Item label="Tiêu đề">{selectedNhaTro.title}</Descriptions.Item>
                                        <Descriptions.Item label="Địa chỉ">{selectedNhaTro.address}</Descriptions.Item>
                                        <Descriptions.Item label="Giá">
                                            {selectedNhaTro.price?.toLocaleString('vi-VN')} VNĐ
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Mô tả">
                                            {selectedNhaTro.description}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Người đăng">
                                            {selectedNhaTro.fullName} ({selectedNhaTro.email})
                                        </Descriptions.Item>
                                        {selectedNhaTro.status === 0 && (
                                            <Descriptions.Item label="Lý do từ chối" className="text-red-500">
                                                {selectedNhaTro.rejectionReason}
                                            </Descriptions.Item>
                                        )}
                                    </Descriptions>

                                    <div style={{ marginTop: 16 }}>
                                        <h4>Hình ảnh</h4>
                                        <Image.PreviewGroup>
                                            <Space wrap>
                                                {selectedNhaTro.imageUrls.map((url, index) => (
                                                    <Image
                                                        key={index}
                                                        width={150}
                                                        src={url}
                                                        alt={`Ảnh ${index + 1}`}
                                                    />
                                                ))}
                                            </Space>
                                        </Image.PreviewGroup>
                                    </div>
                                </>
                            )}
                        </Drawer>
                        <Modal
                            title="Chỉnh sửa thông tin nhà trọ"
                            open={isEditModalVisible}
                            onCancel={() => setIsEditModalVisible(false)}
                            footer={null}
                        >
                            <Form
                                form={editForm}
                                layout="vertical"
                                onFinish={(values) => {
                                    updateNhaTro.mutate(values);
                                }}
                            >
                                <Form.Item name="id" hidden>
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="title"
                                    label="Tiêu đề"
                                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="address"
                                    label="Địa chỉ"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="price"
                                    label="Giá"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="description"
                                    label="Mô tả"
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>

                                <Form.Item label="Danh sách ảnh hiện tại">
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {editingImages.map((url, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                <img
                                                    src={url}
                                                    alt={`Ảnh ${index + 1}`}
                                                    style={{
                                                        width: 100,
                                                        height: 100,
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        color: 'red',
                                                        background: 'rgba(255,255,255,0.8)'
                                                    }}
                                                    onClick={() => handleDeleteImage(index)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </Form.Item>

                                <Form.Item label="Thêm ảnh mới">
                                    <Upload
                                        beforeUpload={() => false}
                                        onChange={handleUploadChange}
                                        multiple
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={updateNhaTro.isPending}
                                        >
                                            Cập nhật
                                        </Button>
                                        <Button onClick={() => {
                                            setIsEditModalVisible(false);
                                            setNewImages([]);
                                            setEditingImages([]);
                                        }}>
                                            Hủy
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </>
                )}
            </div>
        </>
    );
};

export default NhaTroManagementPage;