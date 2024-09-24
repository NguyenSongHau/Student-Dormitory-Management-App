import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';
const URL_TYPE = '/api';
const API_VERSION = '/v1';

const API_URL = `${BASE_URL}${URL_TYPE}${API_VERSION}/`;

export const endPoints = {
    ////Account
    //POST: Lấy access token đăng nhập
    token: '/o/token/',
    //GET: Xem thông tin tài khoản đang đăng nhập
    'current-user': '/users/current-user/',
    //PATCH: Cập nhập thông tin tài khoản người dùng
    update: '/users/current-user/update/',
    //POST: Đăng ký tài khoản cho sinh viên
    register: '/users/register/'
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