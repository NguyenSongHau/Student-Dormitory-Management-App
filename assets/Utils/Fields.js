import { roles } from "../Configs/Constants";

export const signInFields = [
    {
        label: 'Email',
        name: 'username',
        icon: 'email-outline'
    },
    {
        label: 'Mật khẩu',
        name: 'password',
        icon: 'eye-outline',
    },
];

export const signUpFields = [
    {
        label: 'Email',
        name: 'email',
        icon: 'email-outline',
    },
    {
        label: 'Mật khẩu',
        name: 'password',
        icon: 'eye-outline',
    },
    {
        label: 'Xác nhận mật khẩu',
        name: 'confirm',
        icon: 'eye-outline',
    },
    {
        label: 'Họ và tên',
        name: 'full_name',
        icon: 'account-outline',
    },
    {
        label: 'Ngày sinh',
        name: 'dob',
        icon: 'calendar',
    },
    {
        label: 'CCCD',
        name: 'identification',
        icon: 'card-account-details-outline',
    },
    {
        label: 'Mã số sinh viên',
        name: 'student_id',
        icon: 'card-text-outline',
    },
    {
        label: 'Trường đại học',
        name: 'university',
        icon: 'school-outline',
    },
    {
        label: 'Khoa',
        name: 'faculty',
        icon: 'account-group-outline',
    },
    {
        label: 'Ngành',
        name: 'major',
        icon: 'account-circle-outline',
    },
    {
        label: 'Khóa học',
        name: 'academic_year',
        icon: 'clock-time-one-outline',
    },
];

export const profileSections = (currentAccount) => {
    return [
        {
            title: "Chức năng",
            roles: [roles.ADMINISTRATOR, roles.SPECIALIST],
            items: [
                {
                    label: 'Quản lý phòng',
                    icon: 'door',
                    screen: 'RoomSettings',
                },
                {
                    label: 'Quản lý giường',
                    icon: 'bunk-bed-outline',
                    screen: 'BedSettings',
                },
                {
                    label: 'Quản lý hồ sơ',
                    icon: 'newspaper-variant-outline',
                    screen: 'RentalContactSettings',
                },
                {
                    label: 'Quản lý hóa đơn thuê',
                    icon: 'newspaper-variant-outline',
                    screen: 'receipt-text-outline',
                },
            ]
        },
        {
            title: "Tiện ích",
            roles: [roles.STUDENT],
            items: [
                {
                    label: 'Hóa đơn thuê',
                    icon: 'currency-usd',
                    screen: 'StudentBillRentalContact',
                },
                {
                    label: 'Hóa đơn điện, nước',
                    icon: 'wind-turbine',
                    screen: 'StudentElectricAndWaterBill',
                },
                {
                    label: 'Vi phạm phòng',
                    icon: 'note-text',
                    screen: 'StudentViolateNotice',
                }
            ]
        },
        {
            title: "Chức năng",
            roles: [roles.ADMINISTRATOR, roles.MANAGER],
            items: [
                {
                    label: 'Quản lý hóa đơn điện, nước',
                    icon: 'wind-energy-outline',
                    screen: 'ElectricAndWaterBillSettings',
                },
                {
                    label: 'Quản lý vi phạm phòng',
                    icon: 'note-outline',
                    screen: 'ViolateNoticeSettings',
                },
            ]
        }
    ];
};