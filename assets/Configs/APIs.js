import axios from 'axios';

const BASE_URL = 'http://192.168.1.3:8000';
const URL_TYPE = 'api';
const API_VERSION = 'v1';

const API_URL = `${BASE_URL}/${URL_TYPE}/${API_VERSION}`;

export const CLIENT_ID = '5con2xGAVGKxI5oQE1rjGALlWQwP5y2pWb0BYAiv';
export const CLIENT_SECRET = 'XTvYQjkgRAb5y23otSGtiuS2Tt1jL62oMpZvtxYAc2XA2l1SqFNhXj2g55KnjBB1rBucIZYX9n6dNairGxj8gQhMdWYWq91qAG9rSLZGhESh1TTvYRXl7N0pF8zTC9tg';

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