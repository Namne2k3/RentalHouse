import axios from "axios";
import { BASE_URL } from "../constants/url";

// config mặc định URL backend cho mỗi lần request api
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 4000
});

// config cho axios nếu có token sẽ gửi token kèm theo cho mỗi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;