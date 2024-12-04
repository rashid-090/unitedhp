import "./App.css";
import { ScrollToTop } from "react-router-scroll-to-top";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazy, Suspense, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import {Header, Footer} from './components';

// userpages
import Home from './pages/Home';


// adminpages
import Sidebar from "./pages/admin/layouts/sidebar";
import Topbar from "./pages/admin/layouts/topbar";
import Login from './pages/admin/login'
import Dashboard from './pages/admin/dashboard'
import AddDeler from './pages/admin/add_deler'
import AllDeler from './pages/admin/All_delers'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/'; // Adjust the path as needed

  return (
    <>
      <ScrollToTop />
      <ToastContainer position="bottom-right" />
      <div className="2xl:max-w-[1536px] relative mx-auto min-h-screen flex flex-col justify-between">
      <div className="relative h-screen">
      {!isLoginPage && <Sidebar onSidebarOpen={setIsSidebarOpen} />}
      <div
        className={`relative ${!isLoginPage ? 'pl-12' : 'pl-0'} transition-all duration-300 ${
          isSidebarOpen ? 'blur-sm shadow-lg' : ''
        }`}
      >
        <div className="h-screen overflow-y-scroll">
          {/* Replace Topbar and Outlet with your components */}
          {!isLoginPage && <Topbar /> }
          <div className="p-5"><Outlet /></div>
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
      <ToastContainer position="bottom-right"/>
      <div className="2xl:max-w-[1536px] relative mx-auto min-h-screen flex flex-col justify-between">
        <Header/>
        <Outlet />
        <Footer/>
      </div>
    </>
  );
};

function App() {
  const [isAdminView, setIsAdminView] = useState(true); //  admin view

  const router = createBrowserRouter([
    {
      path: "/",
      element: isAdminView ? <AdminLayout /> : <UserLayout />,
      children: [
        // User Routes
        ...(!isAdminView
          ? [
              { path: "/", element: <Suspense fallback={<p>Loading screen..</p>}><Home /></Suspense> },
              { path: "*", element: <Suspense fallback={<p>Loading screen..</p>}><p>page not found</p></Suspense> },
            ]
          : []),
        // Admin Routes
        ...(isAdminView
          ? [
              { path: "/", element: <Suspense fallback={<p>Loading screen..</p>}><Login/></Suspense> },
              { path: "/dashboard", element: <Suspense fallback={<p>Loading screen..</p>}><Dashboard/></Suspense> },
              { path: "/add-delers", element: <Suspense fallback={<p>Loading screen..</p>}><AddDeler/></Suspense> },
              { path: "/all-delers", element: <Suspense fallback={<p>Loading screen..</p>}><AllDeler/></Suspense> },
            ]
          : []),
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