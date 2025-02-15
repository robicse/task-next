"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useTransition } from "react";
import { FaPlus } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import DashboardTopInfo from "./DashboardTopInfo";
import { getUserDashboard } from "@/app/services/userdashboard/getUserDashboard";
import { toast } from "react-toastify";

const CustomerDashboardRightSide = () => {
    const [menuStates, setMenuStates] = useState({});
    const menuRefs = useRef([]);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [customerAddress, setCustomerAddress] = useState([]);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [userDashboard, setUserDashboard] = useState({});
    const [liveUpdate, setLiveUpdate] = useState(true);
    const [isPending, startTransition] = useTransition();

    const { data: session, status } = useSession();

    useEffect(() => {
        const handleClick = (event) => {
            handleClickOutside(event);
        };
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    useEffect(() => {
        const handleGetShippingAddress = async () => {
            try {
                const data = await getCustomerAllShippingAddress(session?.accessToken);
                setCustomerAddress(data.results);
                const defaultAddr = data.results.find((address) => address.set_default === 1);
                setDefaultAddress(defaultAddr);
            } catch (error) {
                console.error("Failed to fetch shipping addresses:", error);
            }
        };
        if (session) handleGetShippingAddress();
    }, [session?.accessToken, liveUpdate]);

    useEffect(() => {
        if (status === "authenticated") {
            const fetchUserDashboardInfo = async () => {
                try {
                    startTransition(async () => {
                        const userDashboardInfo = await getUserDashboard(session?.accessToken);
                        const userDashboardResult = userDashboardInfo?.results;
                        setUserDashboard(userDashboardResult);
                    });
                } catch (error) {
                    console.error("Failed to fetch user dashboard info:", error);
                }
            };
            fetchUserDashboardInfo();
        }
    }, [status, session?.accessToken]);

    if (status === "loading") {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100">
                <h1 className="text-center">Loading... </h1>;
            </div>
        );
    }

    const handleToggleMenu = (event, index, address) => {
        event.stopPropagation();
        setMenuStates((prevStates) => ({
            ...prevStates,
            [index]: !prevStates[index],
        }));

        if (!menuStates[index]) {
            setCurrentAddress(address);
        }
    };

    return (
        <div className="customer-dashboard-section">
            <DashboardTopInfo userDashboard={userDashboard} />
            <div className="d-flex gap-3 flex-column flex-md-row">
                <div className="customer-dashboard-card border-0 flex-1">
                    <div className="p-3 border-bottom">
                        <h2 className="mb-0 customer-dashboard-subtitle">Default Shipping Address</h2>
                    </div>
                    {customerAddress?.length ? (
                        <div className="p-4 d-flex flex-column gap-3 customer-dashboard-address">
                            {customerAddress?.map((allAddress, index) => (
                                <div key={index}>
                                    <div className="shipping-delivery-address-radiobox">
                                        <input
                                            id={`radio${index}`}
                                            type="radio"
                                            name="license-radios"
                                            className="shipping-delivery-address-radio"
                                            defaultChecked={allAddress.set_default === 1}
                                            onChange={() => handleSetDefaultAddress(allAddress?.id)}
                                        />
                                        <label htmlFor={`radio${index}`}>
                                            <span className="license_type_circle"> </span>
                                            <div className="shipping-delivery-radio-info d-flex flex-column gap-2">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <p>{allAddress?.full_name}</p>
                                                    <button className="customer-address-action-btn text-black">
                                                        <div
                                                            className="p-1"
                                                            onClick={(event) => handleToggleMenu(event, index, allAddress)}
                                                        >
                                                            <FaEllipsisVertical />
                                                        </div>
                                                        {menuStates[index] && (
                                                            <div
                                                                ref={(el) => (menuRefs.current[index] = el)}
                                                                className="customer-address-action-container"
                                                            >
                                                                <div
                                                                    className="customer-address-action-item"
                                                                    type="button"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal"
                                                                >
                                                                    Edit
                                                                </div>
                                                                <div
                                                                    onClick={() => handleDeleteAddress(allAddress.id)}
                                                                    className="customer-address-action-item"
                                                                >
                                                                    Delete
                                                                </div>
                                                            </div>
                                                        )}
                                                    </button>
                                                </div>
                                                <span>{allAddress?.phone}</span>
                                                <p>{allAddress?.address}</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4">
                            <div
                                className="mx-auto"
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                            >
                                <div className="add-new-address-bar">
                                    <FaPlus />
                                    <div className="alpha-7">Add New Address</div>
                                </div>
                            </div>
                        </div>
                    )}
                    <ShippingAddressModal currentAddress={currentAddress} session={session} liveUpdate={liveUpdate} setLiveUpdate={setLiveUpdate} />
                </div>
                <AffiliatePartnerStatus userDashboard={userDashboard} isPending={isPending} />
            </div>
        </div>
    );
};

export default CustomerDashboardRightSide;
