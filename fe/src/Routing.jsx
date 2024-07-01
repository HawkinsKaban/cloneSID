
import { createBrowserRouter } from "react-router-dom";
import { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
//SID
import Landing from './sid/pages/landingPage';
import InformasiDesa from "./sid/pages/informasiDesa";
import DetailKegiatanDesa from "./sid/pages/detailKegiatanDesa";
import KegiatanProgramDesa from "./sid/pages/kegiatanProgramDesa";
import Portal from "./sid/pages/portal";
//AUTHENTICATION
import SignUp from './auth/signUp';
import Login from "./auth/login";
import ForgotPassword from "./auth/forgotPassword";
//ASPIRASI
import Aspirasi from "./aspirasi/page/dashboardAspirasi";
import LoginAdmin from "./auth/loginAdminAspirasi/loginAdmin";
import AdminAspirasiPage from "./aspirasi/page/adminAspirasi/AdminAspirasi";
//ADMINISTRATION
import WargaPage from "./administration/pages/administration/warga/warga.page";
import RtPage from "./administration/pages/administration/rt/rt.page";
import RwPage from "./administration/pages/administration/rw/rw.page";
import KasiPage from "./administration/pages/administration/kasi/kasi.page";
import KadesPage from "./administration/pages/administration/kades/kades.page";
import getToken from "./shared/functions/functions";
//ADMIN
import DashboardAdmin from "./admin";

import App from "./App";
const port = import.meta.env.VITE_BASE_API_URL2;

const ProtectedRoute = ({ element, authorizedRoles }) => {
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const id = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get(`${port}v1/user/get/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, [id]);

  const isAuthorized = () => {
    const currentUserRole = userData?.data?.role;
    return authorizedRoles.includes(currentUserRole);
  };

  useEffect(() => {
    if (!loading && !isAuthorized()) {
      navigate('/login');
    }
  }, [loading, userData, navigate]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return isAuthorized() ? element : null;
};

const Routing = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      //AUTHENTICATION
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      //ADMIN
      {
        path: "/dashboard-admin",
        element: <DashboardAdmin />,
      },
      {
        path: "/login-admin",
        element: <LoginAdmin />,
      },
      {
        path: "/admin-aspirasi-page",
        element: <ProtectedRoute
          element={<AdminAspirasiPage />}
          authorizedRoles={[5]}
        />
      },
      //SID
      {
        path: "/informasi-desa",
        element: <InformasiDesa />,
      },
      {
        path: "/kegiatan-program-desa",
        element: <KegiatanProgramDesa />,
      },
      {
        path: "/detail-kegiatan-desa/:id",
        element: <DetailKegiatanDesa />,
      },
      {
        path: "/portal-terintegrasi",
        element: <Portal />,
      },
      //ASPIRATION
      {
        path: "/aspirasi",
        element: <ProtectedRoute
          element={<Aspirasi />}
          authorizedRoles={[1, 2, 3, 4, 5]}
        />,
      },

      //ADMINISTRATION
      {
        path: "/warga",
        element: <ProtectedRoute
          element={<WargaPage />}
          authorizedRoles={[1]}
        />
      },
      {
        path: "/rt",
        element: <ProtectedRoute
          element={<RtPage />}
          authorizedRoles={[2]}
        />
      },
      {
        path: "/rw",
        element: <ProtectedRoute
          element={<RwPage />}
          authorizedRoles={[3]}
        />
      },
      {
        path: "/kasi",
        element: <ProtectedRoute
          element={<KasiPage />}
          authorizedRoles={[4]}
        />
      },
      {
        path: "/kades",
        element: <ProtectedRoute
          element={<KadesPage />}
          authorizedRoles={[1, 2, 3, 4, 5]}
        />
      },

    ],
  },
]);

export default Routing;
