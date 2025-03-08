import { DollarCircleOutlined, HeartOutlined, HomeOutlined, LoadingOutlined, PhoneOutlined, ShareAltOutlined, UserOutlined, WarningOutlined } from "@ant-design/icons"
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon"
import { Avatar, Button, Carousel, Col, Divider, Row, Spin } from "antd"
import L from 'leaflet'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { ReactNode } from "react"
import { IconType } from 'react-icons'
import { BiBath } from "react-icons/bi"
import { LuArmchair } from "react-icons/lu"
import { TbBed } from "react-icons/tb"
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link, useParams } from "react-router"
import Text from "../../components/TextComponent/Text"
import { COLORS } from "../../constants/colors"
import { fonts } from "../../constants/fonts"
import { useRentalDetail } from "../../hooks/useRentalDetailHook"
import { formatCurrencyVnd } from "../../utils"
import './styles.css'
import zalo_icon from '/icons/zalo_icon.png'
import { useRelatedRentals } from "../../hooks/useRelatedRentalHook"
import RelatedRentalComponent from "../../components/RelatedRentalComponent/RelatedRentalComponent"

const customIcon = L.icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface InfoPropertyProps {
    label: string;
    children: ReactNode;
    icon: React.ForwardRefExoticComponent<AntdIconProps> | IconType;
}


const InfoPropertyComponent = ({ label, children, icon: Icon }: InfoPropertyProps) => {
    return (
        <>
            <Row style={{ justifyContent: 'space-between', gap: 12, justifyItems: 'center', alignItems: 'center' }}>
                <Row>
                    <Row style={{ gap: 12, alignItems: 'center' }}>
                        {/* Icon will work with both antd and react-icons */}
                        <Icon style={{ fontSize: '24px', color: COLORS.TAUPE }} />
                        <Text text={label} />
                    </Row>
                </Row>
                {children}
            </Row>
        </>
    )
}

const InfoDetailComponent = ({ title, children }: { title: string, children: ReactNode }) => {
    return (
        <>
            <Divider className="rental-detail-divider" />
            <div>
                <Text text={title} fontFamily={fonts.semiBold} fontSize={18} />
                {children}
            </div>
        </>
    )
}

const RentalDetailPage = () => {
    const { id } = useParams()
    const { data: rental, isLoading, error } = useRentalDetail(id?.toString() || "");
    const { data: relatedRentals } = useRelatedRentals(id?.toString() || "")
    const handleZaloChat = (phoneNumber: string) => {
        if (phoneNumber) {
            const cleanPhoneNumber = phoneNumber?.replace(/[^0-9]/g, '');
            if (!cleanPhoneNumber) {
                console.error('Số điện thoại không hợp lệ');
                return;
            }

            const zaloUrl = `https://zalo.me/${cleanPhoneNumber}`;

            window.open(zaloUrl, '_blank');
        }
    };

    if (error) {
        console.log(error);
    }

    return (
        <>
            {isLoading ? (
                <Spin style={{ color: COLORS.DARK_SLATE }} indicator={<LoadingOutlined spin />} size='large' />
            ) : (
                <>
                    {
                        rental?.id != null ?
                            <div className="rental-detail-container">
                                <Row gutter={[24, 24]} className="rental-detail-content">
                                    <Col xs={24} md={17}>

                                        {/* ảnh nhà trọ */}
                                        <div className="rental-detail-carousel">
                                            <Carousel autoplay arrows>
                                                {rental?.imageUrls.map((img, index) => (
                                                    <div key={index}>
                                                        <img src={img} className="rental-detail-image" />
                                                    </div>
                                                ))}
                                            </Carousel>
                                        </div>

                                        {/* thông tin nhà trọ */}
                                        <div>
                                            <Text text={rental?.title || ""} fontFamily={fonts.bold} fontSize={24} />
                                            <Text text={rental?.address || ""} fontFamily={fonts.medium} fontSize={16} />
                                        </div>
                                        <Divider />
                                        <div className="rental-price-area-layout">
                                            <div className="rental-price-area-container">
                                                <Col>
                                                    <Text text="Mức giá" color={COLORS.TAUPE} fontFamily={fonts.bold} />
                                                    <Text text={`${formatCurrencyVnd(rental?.price ? parseInt(rental.price) : 0)}/tháng`} fontSize={18} fontFamily={fonts.medium} />
                                                </Col>
                                                <Col>
                                                    <Text text="Diện tích" color={COLORS.TAUPE} fontFamily={fonts.bold} />
                                                    <Text text={`${(rental?.area ? parseInt(rental.area) : 0)} m2`} fontSize={18} fontFamily={fonts.medium} />
                                                </Col>
                                            </div>
                                            <div className="rental-price-area-actions">
                                                <Button color="blue" className="rental-detail-action-btn" size="large" icon={<ShareAltOutlined />}>Chia sẻ</Button>
                                                <Button className="rental-detail-action-btn" size="large" icon={<WarningOutlined />}>Báo cáo</Button>
                                                <Button className="rental-detail-action-btn" size="large" icon={<HeartOutlined />}>Lưu</Button>
                                            </div>
                                        </div>


                                        <InfoDetailComponent title="Thông tin mô tả">
                                            <div
                                                className="description-container"
                                                dangerouslySetInnerHTML={{ __html: rental?.descriptionHtml || '' }}
                                            />
                                        </InfoDetailComponent>
                                        <InfoDetailComponent title="Đặc điểm bất động sản">
                                            <div className="property-info-grid">
                                                <InfoPropertyComponent label="Mức giá" icon={DollarCircleOutlined}>
                                                    <Text text={`${formatCurrencyVnd(rental?.price ? parseInt(rental.price) : 0)}/tháng`} fontSize={14} fontFamily={fonts.medium} />
                                                </InfoPropertyComponent>
                                                <InfoPropertyComponent label="Diện tích" icon={HomeOutlined}>
                                                    <Text text={`${rental?.area || 0} m²`} fontSize={14} fontFamily={fonts.medium} />
                                                </InfoPropertyComponent>
                                                <InfoPropertyComponent label="Số phòng ngủ" icon={TbBed}>
                                                    <Text text={`${rental?.bedRoomCount || 0}`} fontSize={14} fontFamily={fonts.medium} />
                                                </InfoPropertyComponent>
                                                <InfoPropertyComponent label="Số phòng tắm, vệ sinh" icon={BiBath}>
                                                    <Text text={`${rental?.bedRoom || 0}`} fontSize={14} fontFamily={fonts.medium} />
                                                </InfoPropertyComponent>
                                                <InfoPropertyComponent label="Nội thất" icon={LuArmchair}>
                                                    <Text text={`${rental?.furniture || 0}`} fontSize={14} fontFamily={fonts.medium} />
                                                </InfoPropertyComponent>
                                            </div>
                                        </InfoDetailComponent>
                                        {rental?.latitude && rental?.longitude && (
                                            <InfoDetailComponent title="Xem trên bản đồ">
                                                <div className="map-container">
                                                    <MapContainer
                                                        center={[parseFloat(rental.latitude), parseFloat(rental.longitude)]}
                                                        zoom={15}
                                                        style={{ height: '400px', width: '100%' }}
                                                    >
                                                        <TileLayer
                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                        />
                                                        <Marker
                                                            position={[parseFloat(rental.latitude), parseFloat(rental.longitude)]}
                                                            icon={customIcon}
                                                        >
                                                            <Popup>
                                                                {rental?.address}
                                                            </Popup>
                                                        </Marker>
                                                    </MapContainer>
                                                </div>
                                            </InfoDetailComponent>
                                        )}
                                    </Col>
                                    <Col xs={24} md={7}>
                                        <div className="contact-section">
                                            <div className="contact-header">
                                                <Avatar
                                                    className="contact-avatar"
                                                    size="large"
                                                    icon={<UserOutlined />}
                                                />
                                                <div className="contact-info">
                                                    <Text text={rental?.fullName || ""} fontSize={16} style={{ margin: 0 }} fontFamily={fonts.bold} />
                                                    <Link to={``} style={{ fontSize: 12, fontFamily: fonts.medium, color: COLORS.DARK_SLATE }}>
                                                        Xem thêm các tin khác
                                                    </Link>
                                                </div>
                                            </div>

                                            <Divider />

                                            <div className="contact-buttons">
                                                <Button onClick={() => handleZaloChat(rental?.phoneNumber || "")} className="contact-button" size="large">
                                                    <img src={zalo_icon} width={24} height={24} />
                                                    <Text text="Chat qua Zalo" fontSize={16} />
                                                </Button>
                                                <Button icon={<PhoneOutlined />} className="contact-button" style={{ backgroundColor: COLORS.TAUPE, color: "white" }} size="large">
                                                    {rental?.phoneNumber}
                                                </Button>
                                            </div>
                                        </div>

                                        <Col className="related-section" style={{ marginTop: 16 }}>
                                            <Text text="Các nhà trọ liên quan" fontFamily={fonts.semiBold} fontSize={16} />
                                            <div>
                                                {
                                                    relatedRentals?.map((item, index) => {
                                                        return <RelatedRentalComponent rental={item} key={index} />
                                                    })
                                                }
                                            </div>
                                        </Col>
                                    </Col>
                                </Row>
                            </div>
                            :
                            <div>
                                <Text text="Không tìm thấy dữ liệu" />
                            </div>
                    }
                </>
            )}
        </>
    )
}

export default RentalDetailPage