import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { ReactNode } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import Text from "../../components/TextComponent/Text";
import { COLORS } from "../../constants/colors";
import './styles.css';
const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    padding: '0 48px', // Thay đổi padding
    height: '64px', // Thêm chiều cao cố định
    backgroundColor: 'transparent',
    overflow: 'hidden', // Ngăn content tràn ra ngoài
    maxWidth: 1200,
    margin: 'auto'
    // border: '1px solid #000'
};

const contentStyle: React.CSSProperties = {
    minHeight: '100vh',
    color: '#fff',
    margin: 16,
    // border: '1px solid #000'
};

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: '#fff',
    margin: 16,
    marginLeft: 0,
    border: `1px solid ${COLORS.TAUPE}`,
    borderRadius: 12
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    // border: '1px solid #000'
};

const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    margin: '12px auto',
    maxWidth: 1200,
    // border: '1px solid #000'
};

interface HomePageProps {
    children: ReactNode;
    slider?: boolean; // Make slider optional with ?
}

const HomePage = ({ children, slider = true }: HomePageProps) => {
    // const { currentPage } = useAppSelector((state) => state.page)
    return (
        <>
            <Header style={headerStyle}>
                <NavbarComponent />
            </Header>
            <Layout style={layoutStyle}>
                <Layout>
                    <Content style={contentStyle}>
                        {
                            // (() => {
                            //     switch (currentPage) {
                            //         case "":
                            //             return <RentalPage />;
                            //         case "news":
                            //             return <NewsPage />;
                            //         case "profile":
                            //             return <ProfilePage />;
                            //         default:
                            //             return <RentalPage />;
                            //     }
                            // })()
                            children
                        }
                    </Content>
                    {
                        slider &&
                        <Sider className="sider_layout" width="25%" style={siderStyle}>
                            <Text text="Các tin tức nổi bật" />
                        </Sider>
                    }
                </Layout>
                <Footer style={footerStyle}>Footer</Footer>
            </Layout>
        </>
    )
}

export default HomePage