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
    //GET: Lấy danh sách chuyên viên và quản lý
    'specialists-managers': '/users/specialists-managers/',

    //GET: Lấy danh sách tất cả bài viết
    post : '/posts/',
    //GET, PATCH, DELETE: Lấy, cập nhập, xóa một bài viết
    'post-detail': (postID) => `/posts/${postID}/`,

    //GET, POST: Lấy danh sách tất cả các phòng và tạo phòng
    rooms: '/rooms/',
    //GET, PATCH, DELETE: Lấy, cập nhập, xóa một phòng
    'room-detail': (roomID) => `/rooms/${roomID}/`,
    
    //GET, PATCH, DELETE: Lấy, cập nhập, xóa một giường
    'bed-detail': (bedID) => `/beds/${bedID}/`,
    //POST: Thuê giường
    'rent-bed': (bedID) => `/beds/${bedID}/rent/`,

    //GET: Lấy danh sách hồ sơ thuê của sinh viên đã đăng ký
    'rental-contact-student' : '/users/students/rental-contacts/',
    'rental-contact-detail-student':  (rentalContactID) => `/users/students/rental-contacts/${rentalContactID}/`,
    //POST: Sinh viên hủy hồ sơ đăng ký
    'cancel-rental-contact':  (rentalContactID) => `/rental-contacts/${rentalContactID}/cancel/`,
    //POST: Chuyên viên duyệt hồ sơ
    'confirm-rental-contact':  (rentalContactID) => `/rental-contacts/${rentalContactID}/confirm/`,
    //POST: Chuyên viên từ chối hồ sơ
    'reject-rental-contact':  (rentalContactID) => `/rental-contacts/${rentalContactID}/reject/`,
    //GET: Lấy danh sách hồ sơ thuê cho Chuyên viên
    'rental-contacts' : '/rental-contacts/',
    //GET: Lấy thông tin một hồ sơ cho Chuyên viên
    'rental-contact-details' : (rentalContactID) => `/rental-contacts/${rentalContactID}/`,

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