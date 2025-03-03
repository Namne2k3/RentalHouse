import { HeartFilled, HeartOutlined, PhoneFilled, UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Image, Space, Typography } from "antd";
import { COLORS } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { NhaTro } from "../../hooks/rentalHook";
import Text from "../TextComponent/Text";
import './styles.css';
import 'dayjs/locale/vi';
import { formatPhoneNumber, formatCurrencyVnd } from "../../utils";

const { Paragraph } = Typography;
type Props = {
    rental: NhaTro,
    onAddToSaveList: (id: number) => void,
    onRemoveFromSaveList: (id: number) => void,
    isSaved: boolean,
    handleCopyPhoneNumber: (phoneNumber: string) => void
}
const RentalCardComponent = ({ rental, handleCopyPhoneNumber, onAddToSaveList, onRemoveFromSaveList, isSaved = false }: Props) => {
    return (
        <Flex
            vertical
            style={{
                marginTop: 16,
                borderRadius: 12,
                border: "1px solid #ccc",
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'
            }}
        >
            <div style={{
                width: '100%',
                overflow: 'hidden'
            }}>
                <Image
                    src={rental.imageUrls[0]}
                    width='100%'
                    height={300}
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12
                    }}
                    preview={false}
                />
            </div>
            <div style={{
                margin: '4px 16px 16px'
            }}>
                <Text
                    style={{
                        textTransform: "uppercase",
                        marginBottom: 0
                    }}
                    fontFamily={fonts.bold}
                    text={rental.title.toString()}
                />
                <Space style={{ marginTop: 4 }}>
                    <Text style={{ display: "inline" }} fontFamily={fonts.semiBold} color="red" text={`${formatCurrencyVnd(parseInt(rental.price))}/tháng`} />
                    <Text text="." style={{ display: "inline" }} />
                    <Text style={{ display: "inline" }} fontFamily={fonts.semiBold} color="red" text={`${rental.area?.toString()} m2`} />
                    <Text text="." style={{ display: "inline" }} />
                </Space>
                <Paragraph
                    style={{ fontFamily: fonts.medium, marginTop: 4 }}
                    ellipsis={{ rows: 3 }}
                >
                    {rental.description}
                </Paragraph>
            </div>

            <Flex justify="space-between" align="center" style={{ borderRadius: 12, padding: 16 }}>
                <Flex align="center">
                    <Avatar
                        style={{
                            backgroundColor: COLORS.DARK_SLATE,
                            cursor: 'pointer'
                        }}
                        icon={<UserOutlined />}
                    />
                    <Flex vertical align="center" style={{ marginLeft: 12 }}>
                        <Text fontSize={12} style={{ margin: 0 }} text={rental.fullName} fontFamily={fonts.bold} />
                        <Text
                            fontSize={12}
                            fontFamily={fonts.regular}
                            color={COLORS.TAUPE}
                            style={{ margin: 0 }}
                            text={
                                rental.postedDate ? new Date(rental.postedDate).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }) : ''
                            }
                        />
                    </Flex>
                </Flex>

                <Flex align="center" gap={8}>
                    <Flex onClick={() => handleCopyPhoneNumber(rental.phoneNumber)} gap={8} align="center" style={{ cursor: "pointer", padding: 8, backgroundColor: COLORS.DARK_SLATE, borderRadius: 12 }}>
                        <PhoneFilled style={{ fontSize: 18 }} color="#fff" />
                        <Text style={{ margin: 0, padding: 0 }} fontFamily={fonts.bold} text={formatPhoneNumber(rental.phoneNumber)} color="#fff" />
                    </Flex>
                    <Flex onClick={isSaved ? () => onRemoveFromSaveList(rental.id) : () => onAddToSaveList(rental.id)} align="center" style={{ cursor: "pointer", padding: 8, backgroundColor: COLORS.DARK_SLATE, borderRadius: 12 }}>
                        {
                            isSaved ?
                                <HeartFilled style={{ fontSize: 18, color: COLORS.TAUPE }} />
                                :
                                <HeartOutlined style={{ fontSize: 18 }} />
                        }
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default RentalCardComponent;