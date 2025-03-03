import { LoadingOutlined } from "@ant-design/icons";
import { Pagination, Spin } from "antd";
import { useCallback } from "react";
import RentalCardComponent from "../../components/RentalCardComponent/RentalCardComponent";
import Text from "../../components/TextComponent/Text";
import { COLORS } from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useRentals } from "../../hooks/rentalHook";
import { savedRentalsSelector } from "../../store/selectors/savedRentalsSelector";
import { addFavoriteLocally, addNhaTroToSaveList, removeFavoriteLocally } from "../../store/slices/favoriteSlice";
import { setCurrentPagination } from "../../store/slices/pageSlice";
import SearchComponent from "../../components/SearchComponent/SearchComponent";

const RentalPage = () => {
    const dispatch = useAppDispatch();
    const savedRentals = useAppSelector(savedRentalsSelector);
    const { search } = useAppSelector((state) => state.search)
    const { currentPagination, currentPageSize } = useAppSelector((state) => state.page);
    const { data: rentals, isLoading, error } = useRentals({ page: currentPagination, pageSize: currentPageSize, address: search });

    const handleChangePagination = useCallback((number: number, pageSize: number) => {
        dispatch(setCurrentPagination({ currentPagination: number, currentPageSize: pageSize }));
    }, [dispatch]);

    const handleAddNhaTroToSaveList = useCallback((nhaTroId: number) => {
        dispatch(addFavoriteLocally(nhaTroId));
        dispatch(addNhaTroToSaveList({ nhaTroId }));
    }, [dispatch]);

    const handleRemoveNhaTroFromSaveList = useCallback((nhaTroId: number) => {
        dispatch(removeFavoriteLocally(nhaTroId));
    }, [dispatch]);

    const handleCopyPhoneNumber = useCallback((phoneNumber: string) => {
        navigator.clipboard.writeText(phoneNumber)
        alert("Copied the text: " + phoneNumber);
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
            <SearchComponent />
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "4px"
            }}>
                <Text
                    text={`Hiện đang có `}
                    style={{ display: 'inline' }}
                />
                <Text
                    text={`${rentals?.totalItems ?? 0}`}
                    style={{
                        fontWeight: 'bold',
                        display: 'inline'
                    }}
                />
                <Text
                    text={` phòng trọ đang cho thuê`}
                    style={{ display: 'inline' }}
                />
            </div>
            {
                rentals?.data?.map((item) => (
                    <RentalCardComponent
                        key={item.id}
                        rental={item}
                        isSaved={savedRentals.includes(item.id)}
                        handleCopyPhoneNumber={handleCopyPhoneNumber}
                        onAddToSaveList={() => handleAddNhaTroToSaveList(item.id)}
                        onRemoveFromSaveList={() => handleRemoveNhaTroFromSaveList(item.id)}
                    />
                ))
            }
            <div style={{ marginTop: 24 }}>
                <Pagination align="center" pageSize={currentPageSize} onChange={handleChangePagination} defaultCurrent={currentPagination} total={rentals?.totalItems} />
            </div>
        </div>
    );
};

export default RentalPage;