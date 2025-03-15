
import { ArrowLeftOutlined, BookOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from 'antd';
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router";
import FooterComponent from "../components/FooterComponent/FooterComponent";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setCurrentGeneralSettingPage } from "../store/slices/generalPageSlice";
import { FaPeopleGroup } from "react-icons/fa6";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'GeneralPage',
        icon: <SettingOutlined />,
        label: 'Tổng quan'
    },
    {
        key: 'RentalPostManagementPage',
        icon: <BookOutlined />,
        label: 'Quản lý đăng tin',
        children: [
            { key: 'ListRentalPage', label: 'Danh sách tin' },
            { key: '23', label: 'Option 3' },
            { key: '24', label: 'Option 4' },
        ],
    },
    {
        key: 'ProfilePage',
        icon: <UserOutlined />,
        label: 'Quản lý tài khoản'
    },
    {
        key: 'ProfilePage',
        icon: <FaPeopleGroup />,
        label: 'Quản lý khách hàng'
    },
]

interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
        items2.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]);

const GeneralSettingLayout = ({ children }: { children: ReactNode }) => {

    const [stateOpenKeys, setStateOpenKeys] = useState(['1']);
    const { generalPage } = useAppSelector((state) => state.generalSetting)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        console.log(e.key);
        dispatch(setCurrentGeneralSettingPage(e.key))

    };

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

            setStateOpenKeys(
                openKeys
                    .filter((_, index) => index !== repeatIndex)
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            setStateOpenKeys(openKeys);
        }
    };

    return (
        <>
            <div style={{ display: "flex", height: "100vh" }}>
                <div style={{
                    borderRight: "1px solid #ccc",
                    display: "flex",
                    flexDirection: 'column',
                    justifyContent: "space-between",
                    padding: 12,
                    overflow: "auto"
                }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        openKeys={stateOpenKeys}
                        onOpenChange={onOpenChange}
                        onClick={handleMenuClick}
                        style={{
                            width: 256,
                            borderRight: 0,
                            flex: 1,
                            overflow: "auto"
                        }}
                        items={items}
                    />
                    <Button onClick={() => navigate("/")} icon={<ArrowLeftOutlined />} style={{ marginTop: 16 }}>
                        Trang chủ
                    </Button>
                </div>
                <div style={{
                    flex: 1,
                    padding: '12px',
                    overflow: "auto",
                    // maxWidth: 600,
                    borderRadius: 12
                }}
                >
                    {children}
                </div>
            </div>
            <FooterComponent />
        </>
    )
}

export default GeneralSettingLayout