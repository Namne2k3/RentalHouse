import React, { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { getCurrentUser } from "../store/slices/authSlice";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (token) {
            dispatch(getCurrentUser())
        }
    }, [token, dispatch])

    return (
        <>
            {children}
        </>
    );
}