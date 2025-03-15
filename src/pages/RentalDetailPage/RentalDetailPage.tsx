import { BookOutlined, CheckCircleFilled, DollarCircleOutlined, HeartOutlined, HomeOutlined, LoadingOutlined, PhoneOutlined, ShareAltOutlined, SmileOutlined, UserOutlined, WarningOutlined } from "@ant-design/icons"
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon"
import { Avatar, Button, Carousel, Col, DatePicker, Divider, Empty, Modal, Popconfirm, Row, Spin, TimePicker, notification } from "antd"
import L from 'leaflet'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { ReactNode, useState } from "react"
import { IconType } from 'react-icons'
import { BiBath } from "react-icons/bi"
import { LuArmchair, LuNotebookPen } from "react-icons/lu"
import { TbBed } from "react-icons/tb"
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link, useParams } from "react-router"
import RelatedRentalComponent from "../../components/RelatedRentalComponent/RelatedRentalComponent"
import Text from "../../components/TextComponent/Text"
import { COLORS } from "../../constants/colors"
import { fonts } from "../../constants/fonts"
import { useAppDispatch, useAppSelector } from "../../hooks"
import { useRelatedRentals } from "../../hooks/useRelatedRentalHook"
import { useRentalDetail } from "../../hooks/useRentalDetailHook"
import { addNhaTroToSaveList, removeNhaTroFromSaveList } from "../../store/slices/favoriteSlice"
import { formatCurrencyVnd } from "../../utils"
import './styles.css'
import zalo_icon from '/icons/zalo_icon.png'
import dayjs from "dayjs"

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
    const { savedRentalData } = useAppSelector(state => state.favorite)
    const [api, contextHolder] = notification.useNotification();
    const dispatch = useAppDispatch()
    const [openModal, setOpenModal] = useState(false)

    const showModal = () => {
        setOpenModal(true)
    }

    const openNotification = (message: string) => {
        api.open({
            message: message,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
    };

    const handleRemoveNhaTroFromSaveList = (nhaTroId: number) => {
        dispatch(removeNhaTroFromSaveList({ id: nhaTroId }));
    }

    const handleAddNhaTroToSaveList = (nhaTroId: number) => {
        const { isSuccess } = dispatch(addNhaTroToSaveList({ id: nhaTroId }))
        if (isSuccess)
            openNotification("Đã lưu thông tin nhà trọ")
    }

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

    const handleSubmitBooking = () => {
        console.log('booking');

    }

    if (error) {
        console.log(error);
    }

    return (
        <>
            {contextHolder}
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
                                                {rental?.imageUrls.map((img: string, index: number) => (
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

                                                {
                                                    savedRentalData.map(item => item.nhaTroId).includes(Number(id))
                                                        ?
                                                        <Popconfirm
                                                            title="Bỏ lưu"
                                                            description="Bạn có chắc chắn bỏ lưu thông tin nhà trọ này?"
                                                            okText="Bỏ lưu"
                                                            cancelText="Hủy"
                                                            onConfirm={() => handleRemoveNhaTroFromSaveList(Number(id))}
                                                        >
                                                            <Button className="rental-detail-action-btn" size="large" icon={<CheckCircleFilled />}>Đã lưu</Button>
                                                        </Popconfirm>
                                                        :
                                                        <Button onClick={() => handleAddNhaTroToSaveList(id)} className="rental-detail-action-btn" size="large" icon={<HeartOutlined />}>Lưu</Button>
                                                }
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
                                                    <Text text={`${rental?.bathRoom || 0}`} fontSize={14} fontFamily={fonts.medium} />
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
                                                <Button icon={<PhoneOutlined />} className="contact-button" style={{ backgroundColor: COLORS.DARK_SLATE, color: "white" }} size="large">
                                                    SDT: {rental?.phoneNumber}
                                                </Button>
                                                <Button onClick={showModal} iconPosition="start" icon={<LuNotebookPen />} className="contact-button" style={{ backgroundColor: COLORS.DARK_SLATE, color: "white" }} size="large">
                                                    Đặt lịch xem trực tiếp
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
                            <Empty
                                description='Không tìm thấy dữ liệu'
                            />
                    }
                    <Modal
                        open={openModal}
                        title={<Text text="Đặt lịch hẹn trực tiếp" fontFamily={fonts.bold} fontSize={24} />}
                        okText="Đặt lịch"
                        cancelText="Hủy"
                        onOk={handleSubmitBooking}
                        onCancel={() => setOpenModal(false)}
                    >
                        <div style={{
                            display: "flex",
                            flexDirection: 'column',
                            gap: 12
                        }}>
                            <div style={{
                                borderRadius: 12,
                                padding: 12,
                                border: "1px solid #ccc",
                            }}>
                                <Row style={{ gap: 12 }}>
                                    <UserOutlined />
                                    <Text fontSize={16} fontFamily={fonts.bold} text="Thông tin chủ nhà trọ" />
                                </Row>
                                <Divider style={{ margin: "4px 0" }} />
                                <div>
                                    <Text fontFamily={fonts.medium} text={`Tên: ${rental?.fullName}`} />
                                    <Text fontFamily={fonts.medium} text={`Email: ${rental?.email}`} />
                                    <Text fontFamily={fonts.medium} text={`Số điện thoại: ${rental?.phoneNumber}`} />
                                </div>
                            </div>
                            <div style={{
                                borderRadius: 12,
                                padding: 12,
                                border: "1px solid #ccc",
                            }}>


                                <Row style={{ gap: 12 }}>
                                    <BookOutlined />
                                    <Text fontSize={16} fontFamily={fonts.bold} text="Thông tin đặt lịch" />
                                </Row>
                                <Divider style={{ margin: "4px 0" }} />

                                <Text fontSize={16} fontFamily={fonts.bold} text="" />
                                <Row style={{ gap: 8, marginTop: 12 }}>

                                </Row>

                                <Text fontSize={16} fontFamily={fonts.bold} text="Ngày hẹn" />
                                <Row style={{ gap: 8, marginTop: 12 }}>
                                    <DatePicker style={{ flex: 1, borderColor: COLORS.DARK_SLATE }} onChange={(date) => console.log(dayjs(date).format("DD/MM/YYYY"))} />
                                    <TimePicker style={{ flex: 1, borderColor: COLORS.DARK_SLATE }} onChange={(time) => console.log(`${dayjs(time).hour()}:${dayjs(time).minute()}`)} />
                                </Row>
                            </div>

                        </div>
                    </Modal>
                </>
            )}
        </>
    )
}

export default RentalDetailPage