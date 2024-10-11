import axios from 'axios';

const BASE_URL = 'https://studentdormitory.vercel.app';
const URL_TYPE = 'api';
const API_VERSION = 'v1';

const API_URL = `${BASE_URL}/${URL_TYPE}/${API_VERSION}`;

export const CLIENT_ID = 'uOqz2uf28tiT7Xt8C4XMwjJlAat4Wiv4jg9svICb';
export const CLIENT_SECRET = 'MF9xWpb21LaGo4jMIuBJxeyx8jPMUi3KV8Gpj2hjps5mzEnDU6jJDCDMFPlUH2Zg2nofbfN2L1rmrhU50PXV61mvC7GFBeF9EeiGc9oxXxJ6QlkkbqVfKGiZAQ4bAYXo';

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

    //GET, PATCH, DELETE: Lấy, cập nhập, xóa một phòng
    'room-detail': (roomID) => `/rooms/${roomID}/`,
    
    //GET, PATCH, DELETE: Lấy, cập nhập, xóa một giường
    'bed-detail': (bedID) => `/beds/${bedID}/`,
    //POST: Thuê giường
    'rent-bed': (bedID) => `/beds/${bedID}/rent/`,

    //GET: Lấy danh sách hồ sơ thuê của sinh viên đã đăng ký
    'rental-contact-student' : '/users/students/rental-contacts/',

    //GET, POST: Lấy danh sách bình luận và bình luận vào bài viết
    comments : (postID) => `/posts/${postID}/comments/`,
    //PUT, DELETE: Cập nhập và xóa bình luận của bài viết
    'comment-detail': (commentID) => `/comments/${commentID}/`
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