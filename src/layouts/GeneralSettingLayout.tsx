import { CalendarFilled, CalendarOutlined, ContainerOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, MenuItemProps } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Sider, Content } = Layout;

const GeneralSettingLayout = ({ children }) => {
    const navigate = useNavigate();
    const { generalPage } = useParams(); // Lấy giá trị từ URL

    // Danh sách menu
    const items: MenuItemProps = [
        { key: "GeneralPage", label: "Cài đặt chung", icon: <SettingOutlined /> },
        { key: "ListRentalPage", label: "Quản lý bài đăng", icon: <ContainerOutlined /> },
        { key: "ProfilePage", label: "Hồ sơ", icon: <UserOutlined /> },
        { key: "UserAppointmentManagementPage", label: "Lịch hẹn khách hàng", icon: <CalendarOutlined /> },
        { key: "CustomerAppointmentManagementPage", label: "Lịch hẹn chủ trọ", icon: <CalendarFilled /> },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sider style={{ backgroundColor: "#fff" }}>
                <Menu
                    mode="inline"
                    selectedKeys={[generalPage]} // Đồng bộ với URL
                    onClick={(e) => navigate(`/generalSetting/${e.key}`)} // Điều hướng
                    items={items}
                />
            </Sider>

            {/* Nội dung */}
            <Layout>
                <Content style={{ padding: 24 }}>{children}</Content>
            </Layout>
        </Layout>
    );
};

export default GeneralSettingLayout;
