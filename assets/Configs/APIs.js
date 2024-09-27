import axios from 'axios';

const BASE_URL = 'http://192.168.1.9:8000';
const URL_TYPE = 'api';
const API_VERSION = 'v1';

const API_URL = `${BASE_URL}/${URL_TYPE}/${API_VERSION}`;

export const CLIENT_ID = 'ybqYkYQ3JS596LaptJyHbC4GCVFRKcAV0R9zTiLE';
export const CLIENT_SECRET = 'gFKF3RbpaGENg7vFAkAeOAI3tqM8gSPazCE1VIMHVuK37ABYPXegwmQXsnUutqTUxze4pwAAh7lMbfsv5fxiQAP9ESoW0gFyWIaorFKzp3nEG7b5F1eoIdn2uNuquth6';

export const endPoints = {
    ////Account
    //POST: Lấy access token đăng nhập
    token: '/o/token/',
    //GET: Xem thông tin tài khoản đang đăng nhập
    'current-user': '/users/current-user/',
    //PATCH: Cập nhập thông tin tài khoản người dùng
    update: '/users/current-user/update/',
    //POST: Đăng ký tài khoản cho sinh viên
    'register-student': '/users/register/',

    rooms: '/rooms/'
};

export default axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const authAPI = (token) => {
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};