import { LoadingOutlined } from "@ant-design/icons";
import { Pagination, Space, Spin } from "antd";
import RentalCardComponent from "../../components/RentalCardComponent/RentalCardComponent";
import Text from "../../components/TextComponent/Text";
import { COLORS } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useRentals } from "../../hooks/rentalHook";
import { setCurrentPagination } from "../../store/slices/pageSlice";
import { useCallback } from "react";


const RentalPage = () => {

    const dispatch = useAppDispatch()
    const { currentPagination, currentPageSize } = useAppSelector((state) => state.page)
    const { data: rentals, isLoading, error } = useRentals({ page: currentPagination, pageSize: currentPageSize });

    const handleChangePagination = (number: number, pageSize: number) => {
        dispatch(setCurrentPagination({ currentPagination: number, currentPageSize: pageSize }))
    }

    const handleAddNhaTroToSaveList = useCallback(async (id: number) => {
        try {
            console.log(id);

        } catch (error) {
            console.log(error);
        }
    }, [])

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin
                    style={{ color: COLORS.DARK_SLATE }}
                    indicator={<LoadingOutlined spin />}
                    size='large'
                />
            </div>
        );
    }

    if (error) {
        console.log(error);
    }

    return (
        <div>
            <Text
                text={`Hiện đang có `}
                style={{ display: 'inline' }}
            />
            <Text
                text={`${rentals?.totalItems}`}
                style={{
                    fontWeight: 'bold',
                    display: 'inline'
                }}
            />
            <Text
                text={` phòng trọ đang cho thuê`}
                style={{ display: 'inline' }}
            />
            {
                rentals?.data?.map((item, index) => {
                    return (
                        <div key={index}>
                            <RentalCardComponent onAddToSaveList={(id: number) => handleAddNhaTroToSaveList(id)} rental={item} />
                        </div>
                    )
                })
            }

            <div style={{ marginTop: 24 }}>

                <Pagination align="center" pageSize={currentPageSize} onChange={handleChangePagination} defaultCurrent={currentPagination} total={rentals?.totalItems} />
            </div>
        </div>
    )
}

export default RentalPage