import React, { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { getCurrentUser } from "../store/slices/authSlice";
import { getCookie } from "../utils";
import { USER_TOKEN_NAME } from "../constants/url";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    const token = getCookie(USER_TOKEN_NAME)

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