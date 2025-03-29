import { BarChartOutlined, CalendarFilled, CalendarOutlined, ContainerOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, MenuItemProps } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Sider, Content } = Layout;

const GeneralSettingLayout = ({ children }) => {
    const navigate = useNavigate();
    const { generalPage } = useParams(); // Lấy giá trị từ URL

    // Danh sách menu
    const items: MenuItemProps = [
        { key: "GeneralPage", label: "Thống kê", icon: <BarChartOutlined /> },
        // { key: "ListRentalPage", label: "Quản lý bài đăng", icon: <ContainerOutlined /> },
        { key: "ProfilePage", label: "Hồ sơ", icon: <UserOutlined /> },
        { key: "MyAppointment", label: "Lịch hẹn của tôi", icon: <CalendarOutlined /> },
        { key: "OwnerAppointment", label: "Lịch hẹn với khách hàng", icon: <CalendarFilled /> },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider style={{ backgroundColor: "#fff", borderRadius: 12 }}>
                <Menu
                    mode="inline"
                    selectedKeys={[generalPage]} // Đồng bộ với URL
                    onClick={(e) => navigate(`/generalSetting/${e.key}`)} // Điều hướng
                    items={items}
                    style={{ backgroundColor: "#fff", borderRadius: 12 }}
                />
            </Sider>
            {/* Sidebar */}

            {/* Nội dung */}
            <Layout>
                <Content style={{ paddingRight: 24, paddingLeft: 24 }}>{children}</Content>
            </Layout>
        </Layout>
    );
};

export default GeneralSettingLayout;
