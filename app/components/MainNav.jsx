"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

function MainNav({ authStatus }) {
    const searchResultRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Prevent hydration issues

    return (
        <div ref={searchResultRef}>
            <div className="col-12">
                <div className="main-header-area d-flex">
                    <div className="header-auth-area d-flex justify-content-end">
                        <ul className="d-flex align-items-center">
                            {/* Cart Icon */}
                            <li>
                                <Link href="/cart-page" className="text-white text-capitalize position-relative">
                                    <span className="bg-white d-flex align-items-center m-0">
                                    </span>
                                </Link>
                            </li>

                            {/* Authentication Links */}
                            {authStatus === "authenticated" ? (
                                <li>
                                    <Link href="/dashboard" className="text-white text-capitalize d-flex align-items-center">
                                        <span className="bg-white d-flex align-items-center">
                                            <FaUser style={{ color: "#44bc9d" }} /> 333
                                        </span>
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <Link href="/login" className="text-white text-capitalize d-flex align-items-center">
                                        Login / Register
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainNav;
