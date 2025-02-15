// import { useSession } from "next-auth/react";
import CustomerLeftSideNavbar from "../components/customerDashboard/CustomerLeftSideNavbar";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function DashboardLayout({ children }) {
    const session = await getServerSession(authOptions);
    console.log('session', session)
    
    return (
        <PrivateRoute>
            <section className="customer-dashboard-section-area">
                <div className="container">
                    <div className="row">
                        <aside className="col-xl-3 d-none d-xl-block">
                            <CustomerLeftSideNavbar authSessionData={session} />
                        </aside>
                    </div>
                </div>
            </section>
        </PrivateRoute>
    )
}