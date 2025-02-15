"use client";

import { useSession } from "next-auth/react";
import MainNav from "./MainNav";
import {
    apiBaseUrl,
} from "../utils";

function Header() {
    const { status, data: session } = useSession();
    

    return (
        <>
            <header>
                <div className="header-wrapper">
                    <div className="container header-container">
                        <MainNav authStatus={status} />
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
