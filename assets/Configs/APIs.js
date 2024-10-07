import axios from 'axios';

const BASE_URL = 'http://192.168.1.3:8000';
const URL_TYPE = 'api';
const API_VERSION = 'v1';

const API_URL = `${BASE_URL}/${URL_TYPE}/${API_VERSION}`;

export const CLIENT_ID = 'p2xw2fFUFlzNAvR2fJqvKRTLszUEkiqAxiVZemmE';
export const CLIENT_SECRET = 'lXk7P97UPJtgDrMVU6Pzc64s3zPZjIPfVzVb2TnEeWb7f9pibQ3qNBn4W1jZKsXRPsFqmiOxkjl7UXbPJBcjKS62Jr4y45sI3JsjGhdgnMM4OGirndd3Srf8GkyugFap';

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

    //GET: Lấy danh sách bài viết
    post : '/posts/',
    //GET, PATCH, DELETE: Lấy, cập nhập, xóa một bài viết
    'post-detail': (postID) => `/posts/${postID}/`,


    //GET, PATCH, DELETE: Lấy, cập nhập, xóa một giường
    'bed-detail': (bedID) => `/beds/${bedID}/`
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