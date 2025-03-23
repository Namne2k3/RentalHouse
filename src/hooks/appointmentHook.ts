import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

interface AppointmentFilter {
    customerName?: string;
    date?: Date;
    status?: string
}

export interface AppointmentDTO {
    id: number,
    userId: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    title: string;
    status: string;
    createAt: Date,
    updatedAt: Date
}

const fetchAppointmentsUser = async (filters: AppointmentFilter): Promise<AppointmentDTO[]> => {
    const response = await api.get('/Appointment/GetUserAppointments', {
        params: filters
    });

    return response.data;
};

export const fetchAppointmentsCustomer = async (filters: AppointmentFilter): Promise<AppointmentDTO[]> => {
    const response = await api.get('/Appointment/GetOwnerAppointments', {
        params: filters
    });

    return response.data;
};

export const useAppointmentsUser = (filters: AppointmentFilter = {}) => {
    return useQuery({
        queryKey: ['appointmentsUser', filters],
        queryFn: () => fetchAppointmentsUser(filters),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        gcTime: 1000 * 60 * 5
    });
};

export const useAppointmentsCustomer = (filters: AppointmentFilter = {}) => {
    return useQuery({
        queryKey: ['appointmentsCustomer', filters],
        queryFn: () => fetchAppointmentsCustomer(filters),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        gcTime: 1000 * 60 * 5
    });
};