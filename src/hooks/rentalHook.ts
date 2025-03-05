import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

interface ResponseNhaTroInfo {
    totalItems: number,
    totalPages: number,
    data: NhaTro[]
}

export interface NhaTro {
    id: number;
    title: string;
    address: string;
    description?: string;
    descriptionHtml?: string;
    url?: string;
    price?: string;
    priceExt?: string;
    area?: string;
    bedRoom?: string;
    postedDate?: Date;
    expiredDate?: Date;
    type?: string;
    code?: string;
    bedRoomCount?: string;
    furniture?: string;
    latitude?: number;
    longitude?: number;
    priceBil?: number;
    priceMil?: number;
    priceVnd?: number;
    areaM2?: number;
    pricePerM2?: number;
    imageUrls: string[];
    userId: number;
    fullName: string,
    phoneNumber: string,
    email: string
}

interface RentalFilters {
    address?: string,
    page?: number,
    pageSize?: number,
    city?: string,
    district?: string,
    commune?: string,
    street?: string,
    price?: number,
    area?: number,
    bedRoomCount?: number,
    price1?: number,
    price2?: number,
    area1?: number,
    area2?: number
}

const fetchNhaTros = async (filters: RentalFilters): Promise<ResponseNhaTroInfo> => {
    const response = await api.get('/NhaTro/GetNhaTrosWithFilters', {
        params: filters
    });
    return response.data;
};

export const useRentals = (filters: RentalFilters = {}) => {
    return useQuery({
        queryKey: ['rentals', filters],
        queryFn: () => fetchNhaTros(filters),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        gcTime: 1000 * 60 * 5
    });
};