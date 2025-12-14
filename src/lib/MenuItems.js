import Link from "next/link";
import {
  DesktopOutlined,
  PieChartOutlined,
  DatabaseFilled,
  VideoCameraOutlined,
  PlayCircleFilled,
  SettingFilled,
} from "@ant-design/icons";

const menuAntItems = [
  {
    key: "1",
    icon: <DatabaseFilled style={{ fontSize: 20 }} />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },
  {
    key: "sub1",
    label: "Tra cứu",
    icon: <PieChartOutlined style={{ fontSize: 20 }} />,
    children: [
      {
        key: "3",
        label: <Link href="/vms">Tra cứu biển báo điện tử</Link>,
      },
      // {
      //   key: "4",
      //   label: "Tra cứu phương tiện",
      // },
    ],
  },
  {
    key: "sub2",
    label: "Giám sát",
    icon: <DesktopOutlined style={{ fontSize: 20 }} />,
    children: [
      {
        key: "6",
        label: <Link href="/#">Giám sát biển báo điện tử</Link>,
      },
      // {
      //   key: "7",
      //   label: <Link href="/#">Giám sát phương tiện</Link>,
      // },
      // {
      //   key: "8",
      //   label: <Link href="/#">Giám sát đèn tín hiệu</Link>,
      // },
    ],
  },
  {
    key: "9",
    icon: <VideoCameraOutlined style={{ fontSize: 20 }} />,
    label: <Link href="/cctv">CCTV</Link>,
  },
  {
    key: "10",
    icon: <PlayCircleFilled style={{ fontSize: 20 }} />,
    label: "Playback Video",
  },
  {
    key: "sub3",
    label: "Quản trị",
    icon: <SettingFilled style={{ fontSize: 20 }} />,
    children: [
      {
        key: "12",
        label: "Cấu hình thiết bị",
        children: [
          {
            key: "13",
            label: <Link href="/camera">Cấu hình Camera</Link>,
          },
          {
            key: "14",
            label: <Link href="/vms">Cấu hình biển báo VMS</Link>,
          },
          {
            key: "15",
            label: <Link href="/trafficLight">Cấu hình Tủ đèn tín hiệu</Link>,
          },
        ],
      },
      {
        key: "16",
        label: "Hệ thống",
        children: [
          {
            key: "17",
            label: "Quản lý người dùng",
          },
          {
            key: "18",
            label: "Quản lý quyền",
          },
          {
            key: "19",
            label: "Quản lý lưu trữ",
          },
        ],
      },
    ],
  },
];

const AdminItems = [
  {
    key: "1",
    label: <Link href="/dashboard">Đổi mật khẩu</Link>,
  },
  {
    key: "2",
    label: <Link href="/traffic">Đăng xuất</Link>,
  },
];
export { menuAntItems, AdminItems };
