import type { TabsProps } from 'antd';
import { Card, Col, Row, Tabs, Typography } from 'antd';
import AccountActivity from '../../components/AccountActivity/AccountActivity';
import AppointmentStatistics from '../../components/AppointmentStatistics/AppointmentStatistics';
import PostStatistics from '../../components/PostStatistics/PostStatistics';


const { Title } = Typography;

const GeneralSettingPage = () => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thống kê bài đăng',
            children: <PostStatistics />,
        },
        {
            key: '2',
            label: 'Thống kê lịch hẹn',
            children: <AppointmentStatistics />,
        },
        {
            key: '3',
            label: 'Hoạt động tài khoản',
            children: <AccountActivity />,
        },
    ];

    return (
        <div className="general-setting-container" >
            <Title level={2}>Thống kê tổng quan</Title>

            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card>
                        <Tabs defaultActiveKey="1" items={items} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default GeneralSettingPage;