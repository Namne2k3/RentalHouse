import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Carousel, Drawer, Empty, Image, Modal, Select, Space, Spin, Table, Tag } from 'antd';
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

const FeedbackManagementPage = () => {
    const [selectedReport, setSelectedReport] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
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
                            setIsDrawerVisible(true);
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
                        {images.map((img: ReportImage, index: number) => (
                            <Image key={index} src={img.imageUrl} width={80} />
                        ))}
                    </Carousel>
                ) : (
                    "Không có ảnh"
                ),
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
            <Drawer
                title="Chi tiết báo cáo"
                placement="right"
                onClose={() => setIsDrawerVisible(false)}
                open={isDrawerVisible}
                width={600}
            >
                {selectedReport && (
                    <div>
                        <p><strong>ID:</strong> {selectedReport.id}</p>
                        <p><strong>Người báo cáo:</strong> {selectedReport.userId}</p>
                        <p><strong>Nhà trọ:</strong> {selectedReport.nhaTroId || 'Không có'}</p>
                        <p><strong>Loại báo cáo:</strong> {selectedReport.reportType}</p>
                        <p><strong>Mô tả:</strong> {selectedReport.description}</p>
                        <p><strong>Trạng thái:</strong>
                            <Tag color={statusColors[selectedReport.status]}>
                                {statusLabels[selectedReport.status]}
                            </Tag>
                        </p>
                        {selectedReport.images?.length > 0 && (
                            <div>
                                <p><strong>Hình ảnh:</strong></p>
                                <Image.PreviewGroup>
                                    <Space wrap>
                                        {selectedReport.images.map((img: ReportImage, index: number) => (
                                            <Image
                                                key={index}
                                                src={img.imageUrl}
                                                width={120}
                                                height={120}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ))}
                                    </Space>
                                </Image.PreviewGroup>
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
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