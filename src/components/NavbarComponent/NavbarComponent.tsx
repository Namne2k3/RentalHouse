import { LoadingOutlined, MenuOutlined } from "@ant-design/icons";
import type { MenuProps } from 'antd';
import { Button, Grid, Image, Menu, Space, Spin, theme } from "antd";
import { useNavigate } from "react-router";
import { COLORS } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setCurrentPage } from "../../store/slices/pageSlice";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { Avatar, Dropdown } from "antd";
import { UserOutlined, CaretDownOutlined } from "@ant-design/icons";
import { logout } from "../../store/slices/authSlice";
import Text from "../TextComponent/Text";
import './styles.css'

const { useToken } = theme;
const { useBreakpoint } = Grid;

const userMenuItems: MenuProps['items'] = [
    {
        key: 'profile',
        label: 'Thông tin cá nhân',
    },
    {
        key: 'settings',
        label: 'Cài đặt',
    },
    {
        type: 'divider',
    },
    {
        key: 'logout',
        label: 'Đăng xuất',
        danger: true,
    },
];

const menuItems = [
    {
        label: "Thuê phòng trọ",
        key: "",
    },
    {
        label: "Tin tức",
        key: "news",
    },
    // {
    //     label: "Products",
    //     key: "SubMenu",
    //     children: [
    //         {
    //             label: "Ant Design System",
    //             key: "product:1",
    //         },
    //         {
    //             label: "Ant Design Charts",
    //             key: "product:2",
    //         },
    //     ],
    // },
    // {
    //     label: "Settings",
    //     key: "alipay",
    // },
];

export default function App() {
    const { token } = useToken();
    const screens = useBreakpoint();
    const navigate = useNavigate()
    const { currentPage } = useAppSelector((state) => state.page)
    const { user, isLoading } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    const handleMenuProfileClick: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case 'logout':
                dispatch(logout());
                break;
            case 'profile':
                dispatch(setCurrentPage(e.key))
                break;
        }
    };

    const onMenuItemClick: MenuProps["onClick"] = (e) => {
        navigate(`/${e.key}`)
        dispatch(setCurrentPage(e.key))
    };

    const styles = {
        container: {
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            margin: "0 auto",
        },
        // header: {
        //     borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
        //     position: "relative" as const,
        //     padding: 0,
        //     [`@media screen and (max-width: ${token.screenMD}px)`]: {
        //         padding: 0
        //     },
        //     [`@media screen and (min-width: ${token.screenMD}px)`]: {
        //         padding: 0
        //     }
        // },
        logo: {
            display: "block",
            height: token.sizeLG,
            left: "50%",
            position: screens.md ? "static" : "absolute",
            top: "50%",
            transform: screens.md ? " " : "translate(-50%, -50%)"
        },
        menu: {
            backgroundColor: "transparent",
            borderBottom: "none",
            lineHeight: screens.sm ? "4rem" : "3.5rem",
            marginLeft: screens.md ? "0px" : `-${token.size}px`,
            width: screens.md ? "inherit" : token.sizeXXL,
            fontFamily: fonts.bold
        },
        menuContainer: {
            alignItems: "center",
            display: "flex",
            gap: token.size,
            width: "100%"
        }
    };

    return (
        <nav className="header">
            <div style={styles.container}>
                <div style={styles.menuContainer}>
                    <Image style={{ borderRadius: 12 }} height={64} src="/images/logo.jpg" />
                    <Menu
                        style={styles.menu}
                        mode="horizontal"
                        items={menuItems}
                        onClick={onMenuItemClick}
                        selectedKeys={screens.md ? [currentPage] : []}
                        overflowedIndicator={
                            <Button type="text" icon={<MenuOutlined />}></Button>
                        }
                    />
                </div>
                {
                    isLoading ?
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Spin style={{ color: COLORS.DARK_SLATE }} indicator={<LoadingOutlined spin />} size='default' />
                        </div>
                        :
                        user == null
                            ?
                            <Space>
                                {screens.md ? <ButtonComponent onClick={() => navigate("/login")} backgroundColor="transparent" color={COLORS.DARK_SLATE} text="Đăng nhập" /> : ""}
                                <ButtonComponent onClick={() => navigate("/sign-up")} text="Đăng ký" />
                            </Space>
                            :
                            <Space align="center" size="small">
                                <Avatar
                                    style={{
                                        backgroundColor: COLORS.DARK_SLATE,
                                        cursor: 'pointer'
                                    }}
                                    icon={<UserOutlined />}
                                />
                                <Dropdown
                                    menu={{
                                        items: userMenuItems,
                                        onClick: handleMenuProfileClick
                                    }}
                                    placement="bottomRight"
                                    trigger={['click']}
                                >
                                    <Space
                                        style={{
                                            cursor: 'pointer',
                                            color: COLORS.DARK_SLATE
                                        }}
                                    >
                                        <Text text={user?.fullName} />
                                        <CaretDownOutlined />
                                    </Space>
                                </Dropdown>
                            </Space>
                }
            </div>
        </nav>
    );
}