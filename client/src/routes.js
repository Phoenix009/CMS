import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//
import Login from "./pages/Login";
import Gunmen from "./pages/Gunmen/Gunmen";
import Register from "./pages/Register";
import AddGunman from "./pages/AddGunman";
import DashboardApp from "./pages/DashboardApp";
import Products from "./pages/Products";
import Blog from "./pages/Blog";
import User from "./pages/User";
import NotFound from "./pages/Page404";
import Branch from "./pages/branch";
import Region from "./pages/Region";
import Vendors from "./pages/Vendors";
// ----------------------------------------------------------------------

export default function Router() {
	return useRoutes([
		{
			path: "/dashboard",
			element: <DashboardLayout />,
			children: [
				{
					path: "/",
					element: <Navigate to="/dashboard/app" replace />,
				},
				{ path: "app", element: <DashboardApp /> },
				{ path: "employees", element: <User /> },
				{ path: "gunmen", element: <Gunmen /> },
				{ path: "branch", element: <Branch /> },
				{ path: "region", element: <Region /> },
				{ path: "vendors", element: <Vendors /> },
				// { path: "gunmen/forms", element: <GunmanForm /> },
				{ path: "products", element: <Products /> },
				{ path: "blog", element: <Blog /> },
			],
		},
		// {
		// 	path: "/vendors",
		// 	element: <LogoOnlyLayout />,
		// 	children: [
		// 		{ path: "attendance", element: <VendorsAttendanceDetails /> },
		// 	],
		// },
		{
			path: "/",
			element: <LogoOnlyLayout />,
			children: [
				{ path: "login", element: <Login /> },
				{ path: "register", element: <Register /> },
				{ path: "404", element: <NotFound /> },
				{ path: "/", element: <Navigate to="/dashboard" /> },
				{ path: "*", element: <Navigate to="/404" /> },
			],
		},
		{
			path: "/forms",
			element: <LogoOnlyLayout />,
			children: [
				{ path: "gunmen", element: <AddGunman /> },
				// { path: "Vehicle", element: <Vehicle /> },
				{ path: "404", element: <NotFound /> },
				{ path: "*", element: <Navigate to="/404" /> },
			],
		},

		{ path: "*", element: <Navigate to="/404" replace /> },
	]);
}
