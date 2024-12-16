import "./App.css";
import { ScrollToTop } from "react-router-scroll-to-top";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Header, Footer } from "./components";

// userpages
import Home from "./pages/Home";

// adminpages
import Sidebar from "./pages/admin/layouts/sidebar";
import Topbar from "./pages/admin/layouts/topbar";
import Login from "./pages/admin/login";
import Dashboard from "./pages/admin/dashboard";
import { useDispatch, useSelector } from "react-redux";
import DistrictCityManager from "./pages/admin/DistrictCityManager";
import { getUserDataFirst } from "./redux/actions/userActions";
import StoreInner from "./pages/StoreInner";
import AllDealer from "./pages/admin/All_delers";
import AddDealer from "./pages/admin/add_deler";
import EditStore from "./pages/admin/EditStore";
import Loading from "./components/Loading";
import ProfilePage from "./pages/admin/ProfilePage";
import EditProfile from "./pages/admin/EditProfile";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; // Adjust the path as needed

  return (
    <>
      <ScrollToTop />
      <ToastContainer position="bottom-right" />
      <div className="2xl:max-w-[100%] relative mx-auto min-h-screen flex flex-col justify-between">
        <div className="relative h-screen">
          {!isLoginPage && <Sidebar onSidebarOpen={setIsSidebarOpen} />}
          <div
            className={`relative ${
              !isLoginPage ? "pl-12" : "pl-0"
            } transition-all duration-300 ${
              isSidebarOpen ? "blur-sm shadow-lg" : ""
            }`}
          >
            <div className="h-screen overflow-y-scroll">
              {/* Replace Topbar and Outlet with your components */}
              {!isLoginPage && <Topbar />}
              <div className="p-5">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const UserLayout = () => {
  return (
    <>
      <ScrollToTop />
      <ToastContainer position="bottom-right" />
      <div className="2xl:max-w-[100%] relative mx-auto min-h-screen flex flex-col justify-start ">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

function App() {

  const { user, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      dispatch(getUserDataFirst());
    }
  }, [dispatch, user]);

  if (loading) {
    return <Loading />;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: user ? (
        user.role === "superAdmin" ? (
          <AdminLayout />
        ) : (
          <UserLayout />
        )
      ) : (
        <UserLayout />
      ),
      children: [
        // Admin Routes
        ...(user && user.role === "superAdmin"
          ? [
              {
                path: "/",
                element: (
                  <Suspense fallback={<Loading/>}>
                    <Dashboard />
                  </Suspense>
                ),
              },
              {
                path: "/location-manage",
                element: (
                  <Suspense fallback={<Loading/>}>
                    <DistrictCityManager />
                  </Suspense>
                ),
              },
              {
                path: "/add-dealers",
                element: (
                  <Suspense fallback={<Loading/>}>
                    <AddDealer />
                  </Suspense>
                ),
              },

              {
                path: "/all-dealers",
                element: (
                  <Suspense fallback={<Loading/>}>
                    <AllDealer />
                  </Suspense>
                ),
              },
              {
                path: "/edit-store/:id",
                element: (
                  <Suspense fallback={<Loading/>}>
                    <EditStore />
                  </Suspense>
                ),
              },
              {
                path: "/profile",
                element: (
                  <Suspense fallback={<Loading/>}>
                    <ProfilePage />
                  </Suspense>
                ),
              },
              {
                path: "/edit-profile",
                element: (
                  <Suspense fallback={<Loading/>}>
                    <EditProfile />
                  </Suspense>
                ),
              },
            ]
          : [
              {
                path: "/",
                element: (
                  <Suspense fallback={<Loading/>}>
                    <Home />
                  </Suspense>
                ),
              },
              {
                path: "/store/:id",
                element: (
                  <Suspense fallback={<Loading/>}>
                    <StoreInner />
                  </Suspense>
                ),
              },

              {
                path: "/login",
                element: (
                  <Suspense fallback={<Loading/>}>
                    <Login />
                  </Suspense>
                ),
              },

              {
                path: "*",
                element: (
                  <Suspense fallback={<Loading/>}>
                    <p>page not found</p>
                  </Suspense>
                ),
              },
            ]),
        // User Routes
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
