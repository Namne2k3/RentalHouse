import React from 'react';
import { Card, Row, Col, Table, Statistic, Spin } from 'antd';
import { Column } from '@ant-design/plots';
import { useRentalViewStats, useRentalStatusStats } from '../../hooks/useRentalStats';
import { RentalViewStats, RentalStatusStats } from '../../types/rental';

const PostStatistics = () => {
    const {
        data: viewStats,
        isLoading: isLoadingViews,
        error: viewError
    } = useRentalViewStats();

    const {
        data: statusStats,
        isLoading: isLoadingStatus,
        error: statusError
    } = useRentalStatusStats();

    if (isLoadingViews || isLoadingStatus) {
        return <Spin size="large" />;
    }

    if (viewError || statusError) {
        return <div>Đã có lỗi xảy ra khi tải dữ liệu</div>;
    }

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'postedDate',
            key: 'postedDate',
            render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Lượt xem',
            dataIndex: 'viewCount',
            key: 'viewCount',
            sorter: (a: RentalViewStats, b: RentalViewStats) => a.viewCount - b.viewCount,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
    ];

    const statusData = statusStats ? [
        { type: 'Đang hoạt động', value: statusStats.activePosts },
        { type: 'Đã hết hạn', value: statusStats.expiredPosts },
        { type: 'Chờ duyệt', value: statusStats.pendingPosts },
    ] : [];

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số bài đăng"
                            value={statusStats?.totalPosts || 0}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Đang hoạt động"
                            value={statusStats?.activePosts || 0}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Đã hết hạn"
                            value={statusStats?.expiredPosts || 0}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Biểu đồ trạng thái bài đăng" style={{ marginBottom: 24 }}>
                <Column
                    data={statusData || []}
                    xField="type"
                    yField="value"
                    label={{
                        position: 'middle',
                        style: {
                            fill: '#FFFFFF',
                            opacity: 0.6,
                        },
                    }}
                />
            </Card>

            <Card title="Thống kê lượt xem bài đăng">
                <Table
                    columns={columns || []}
                    dataSource={viewStats || []}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default PostStatistics;