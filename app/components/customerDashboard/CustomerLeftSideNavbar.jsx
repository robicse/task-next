"use client";
import { getUserDashboard } from "@/app/services/userdashboard/getUserDashboard";
import { PublicUrl, removeRequestPath } from "@/app/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    FaHome,
} from "react-icons/fa";
import SignoutBtn from "../SignoutBtn";
import { useDispatch, useSelector } from "react-redux";
import { setProfilePicture } from "@/app/store/slices/profileSlice";

const CustomerLeftSideNavbar = ({ authSessionData, toggleSidebar }) => {
    const currentPath = usePathname();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isAffiliateUser, setIsAffiliateUser] = useState({});
    const { data: session, status } = useSession();
    const profilePicture = useSelector((state) => state.profile.profilePicture);

    const dispatch = useDispatch();
    
    useEffect(() => {
        if (status === "authenticated") {
            const fetchUserDashboardInfo = async () => {
                try {
                    const userDashboardInfo = await getUserDashboard(
                        session?.accessToken
                    );
                    const userDashboardResult = userDashboardInfo?.results;
                    setIsAffiliateUser(userDashboardResult);
                    dispatch(setProfilePicture(userDashboardResult?.profile_picture));
                } catch (error) {
                    console.error(
                        "Failed to fetch user dashboard info:",
                        error
                    );
                }
            };
            fetchUserDashboardInfo();
        }
    }, [session?.accessToken]);

    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const isActive = (href) => currentPath === href;

    useEffect(() => {
        const firstPartOfPath = currentPath.split("-")[0]; // Get the first part of currentPath
        const sanitizedPath = firstPartOfPath.startsWith("/")
            ? firstPartOfPath.slice(1) // Remove the leading "/" if it exists
            : firstPartOfPath; // Use as is if no "/"
        setActiveDropdown(sanitizedPath);
    }, [currentPath]);

    let profilePic;
    if (profilePicture) {
        profilePic = `${PublicUrl}/${profilePicture}`;
    } else if (isAffiliateUser?.profile_picture && !profilePicture) {
        profilePic = `${PublicUrl}/${isAffiliateUser?.profile_picture}`;
    } else {
        profilePic = "/images/avatar-demo.png"
    }

    return (
        <div className="customer-dashboard-side-nav justify-content-between d-flex flex-column h-100 ">
            <div className="bg-white">
                <div className="p-4 text-center customer-dashboard-profile">
                    <h2>
                        {authSessionData?.user?.name}
                    </h2>
                    <p>{authSessionData?.phone}</p>
                </div>
                <nav className="customer-dashboard-side-navbar bg-white">
                    <ul className="nav flex-column">
                        <li className="nav-item customer-dashboard-nav-item parent-nav-item">
                            <Link
                                onClick={toggleSidebar}
                                className={`${isActive("/dashboard") ? "activ-link" : ""
                                    } nav-link customer-dashboard-nav-link`}
                                href="/dashboard"
                                scroll={false}
                            >
                                <FaHome className="nav-icon me-2" />
                                Dashboard 1111
                            </Link>
                        </li>
                        {status === "authenticated" && (
                            <li className="nav-item customer-dashboard-nav-item">
                                <p className="customer-dashboard-nav-link p-0">
                                    <SignoutBtn />
                                </p>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default CustomerLeftSideNavbar;
