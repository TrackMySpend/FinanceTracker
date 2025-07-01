import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
} from "react-icons/lu";
import { MdGroups } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Income",
        icon: LuWalletMinimal,
        path: "/income",
    },
    {
        id: "03",
        label: "Expense",
        icon: LuHandCoins,
        path: "/expense",
    },
    {
        id: "04",
        label: "Reminders",
        icon: IoNotificationsOutline,
        path: "/reminders",
    },
    {
        id: "05",
        label: "Split Bill",
        icon: MdGroups,
        path: "/split-bill",
    },
    {
        id: "06",
        label: "Settings",
        icon: FiSettings,
        path: "/settings",
    },
    {
        id: "07",
        label: "Logout",
        icon: LuLogOut,
        path: "/logout",
        isLogout: true,
    },
];
