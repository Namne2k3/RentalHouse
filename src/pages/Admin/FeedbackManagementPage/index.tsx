import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Carousel, Descriptions, Empty, Image, Modal, Select, Space, Spin, Table, Tag, Typography } from 'antd';
import api from '../../../services/api';
import { useState } from 'react';
import { CheckOutlined, EyeOutlined } from '@ant-design/icons';

const fetchReports = async () => {
    const { data } = await api.get("/Report"); // Thay URL thực tế
    return data;
};

type ReportImage = {
    id: number;
    reportId: number;
    report: object,
    imageUrl: string
}

const { Text } = Typography;

const FeedbackManagementPage = () => {
    const [selectedReport, setSelectedReport] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ["reports"],
        queryFn: fetchReports,
        initialData: [],
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: number }) => {
            return await api.put(`/Report/UpdateStatus/${id}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            setIsStatusModalVisible(false);
        }
    });

    if (data?.length < 1) return <Empty description="Không có dữ liệu" />
    if (isLoading) return <Spin size="large" className="loading-spinner" />;
    if (error) return <Alert message="Lỗi khi tải dữ liệu" type="error" />;

    const statusColors: Record<number, string> = {
        0: "warning",
        1: "success",
        2: "error",
    };

    const statusLabels: Record<number, string> = {
        0: "Chưa duyệt",
        1: "Đã duyệt",
        2: "Đã từ chối"
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const columns = [
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedReport(record);
                            setIsDetailModalVisible(true);
                        }}
                    >
                        Chi tiết
                    </Button>
                    {record.status === 0 && (
                        <Button
                            type="default"
                            icon={<CheckOutlined />}
                            onClick={() => {
                                setSelectedReport(record);
                                setIsStatusModalVisible(true);
                            }}
                        >
                        </Button>
                    )}
                </Space>
            ),
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Người báo cáo",
            dataIndex: "userId",
            key: "userId",
        },
        {
            title: "Nhà trọ liên quan",
            dataIndex: "nhaTroId",
            key: "nhaTroId",
            render: (nhaTroId: number) => (nhaTroId ? nhaTroId : "Không có"),
        },
        {
            title: "Loại báo cáo",
            dataIndex: "reportType",
            key: "reportType",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: number) => (
                <Tag color={statusColors[status]}>
                    {statusLabels[status]}
                </Tag>
            ),
            filters: [
                { text: 'Chưa duyệt', value: 0 },
                { text: 'Đã duyệt', value: 1 },
                { text: 'Đã từ chối', value: 2 },
            ],
            onFilter: (value: number, record: any) => record.status === value,
        },
        {
            title: "Hình ảnh",
            dataIndex: "images",
            key: "images",
            render: (images: ReportImage[]) =>
                images.length > 0 ? (
                    <Carousel autoplay style={{ width: "100px" }}>
                        {images.map((img: ReportImage, index: number) => {

                            console.log(img);

                            return (
                                <Image key={index} src={img} width={80} />
                            )
                        })}
                    </Carousel>
                ) : (
                    "Không có ảnh"
                ),
        },
        {
            title: "Thời gian báo cáo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => formatDate(date),
        },
    ];

    return (
        <div>
            <h2>Danh sách báo cáo</h2>
            <Table
                columns={columns}
                dataSource={data.data || []}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title="Chi tiết báo cáo"
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                width={800}
                footer={[
                    <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
            >
                {selectedReport && (
                    <div>
                        <Descriptions title="Thông tin báo cáo" bordered column={1}>
                            <Descriptions.Item label="ID báo cáo">{selectedReport.id}</Descriptions.Item>
                            <Descriptions.Item label="Người báo cáo">ID: {selectedReport.userId}</Descriptions.Item>
                            <Descriptions.Item label="Loại báo cáo">{selectedReport.reportType}</Descriptions.Item>
                            <Descriptions.Item label="Nội dung báo cáo">{selectedReport.description}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian báo cáo">{formatDate(selectedReport.createdAt)}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={statusColors[selectedReport.status]}>
                                    {statusLabels[selectedReport.status]}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>

                        {selectedReport.nhaTro && (
                            <div style={{ marginTop: '20px' }}>
                                <Descriptions title="Thông tin nhà trọ bị báo cáo" bordered column={1}>
                                    <Descriptions.Item label="ID nhà trọ">{selectedReport.nhaTro.id}</Descriptions.Item>
                                    <Descriptions.Item label="Tiêu đề">{selectedReport.nhaTro.title}</Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ">{selectedReport.nhaTro.address}</Descriptions.Item>
                                    <Descriptions.Item label="Giá thuê">{formatPrice(selectedReport.nhaTro.price)}/tháng</Descriptions.Item>
                                    <Descriptions.Item label="Diện tích">{selectedReport.nhaTro.area} m²</Descriptions.Item>
                                    <Descriptions.Item label="Nội thất">{selectedReport.nhaTro.furniture}</Descriptions.Item>
                                    <Descriptions.Item label="Lượt xem">{selectedReport.nhaTro.viewCount}</Descriptions.Item>
                                </Descriptions>
                            </div>
                        )}

                        {selectedReport.images?.length > 0 && (
                            <div style={{ marginTop: '20px' }}>
                                <Text strong>Hình ảnh đính kèm báo cáo:</Text>
                                <div style={{ marginTop: '10px' }}>
                                    <Image.PreviewGroup>
                                        <Space wrap>
                                            {selectedReport.images.map((img: string, index: number) => (
                                                <Image
                                                    key={index}
                                                    src={img}
                                                    width={120}
                                                    height={120}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ))}
                                        </Space>
                                    </Image.PreviewGroup>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            <Modal
                title="Xử lý báo cáo"
                open={isStatusModalVisible}
                onCancel={() => setIsStatusModalVisible(false)}
                onOk={() => {
                    if (selectedReport) {
                        updateStatus.mutate({
                            id: selectedReport.id,
                            status: 1 // Approve
                        });
                    }
                }}
                okText="Duyệt"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn duyệt báo cáo này?</p>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn trạng thái"
                    onChange={(value) => {
                        if (selectedReport) {
                            updateStatus.mutate({
                                id: selectedReport.id,
                                status: value
                            });
                        }
                    }}
                >
                    <Select.Option value={1}>Duyệt</Select.Option>
                    <Select.Option value={2}>Từ chối</Select.Option>
                </Select>
            </Modal>
        </div>
    );
}

export default FeedbackManagementPage