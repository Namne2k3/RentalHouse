import React, { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { fetchUserFavorites } from "../store/slices/favoriteSlice";

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (token) {
            dispatch(fetchUserFavorites())
        }
    }, [token, dispatch])

    return (
        <>
            {children}
        </>
    );
}