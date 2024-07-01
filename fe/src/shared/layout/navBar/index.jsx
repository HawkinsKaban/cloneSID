import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './assets/LogoWareng.svg';
import Hamburger from './assets/hamburger.svg';
import LoginIcon from './assets/LoginIcon.svg';
import axios from 'axios';
import './index.css';
import getToken from '../../functions/functions.jsx';

const Navbar = ({ type }) => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const isHome = location.pathname === '/';
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const id = getToken();

    const handleLogout = async () => {
        try {
            const res = await axios.post(`${port}v1/warga/logout/${id}`);
            if (res.status === 200) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                console.log(res);
            }
        } catch (err) {
            console.error(err);
        }
    };
    const handleLogoutAdmin = async () => {
        try {
            const res = await axios.post(`${port}v1/admin/logout-admin/${id}`);
            if (res.status === 200) {
                localStorage.removeItem('token');
                navigate('/login-admin');
            } else {
                console.log(res);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            try {
                const res = await axios.get(`${port}v1/user/get/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchAdminData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            try {
                const res = await axios.get(`${port}v1/admin/get-admin/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setAdminData(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUserData();
        if (userData == null) {
            fetchAdminData();
        }
    }, [id]);
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top pt-1 pt-md-5" style={{ backgroundColor: type ? 'rgba(255, 255, 255, 0)' : 'white', boxShadow: type ? 'none' : '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <Link className="navbar-brand" to="/">
                        <img src={Logo} alt="Logo-WARENG" />
                    </Link>
                </div>
                <button className="navbar-toggler" type="button" onClick={toggleNav} aria-expanded={isNavOpen ? "true" : "false"}>
                    <span className="navbar-toggler-icon">
                        <img src={Hamburger} alt="Icon" />
                    </span>
                </button>
                <div className={`collapse navbar-collapse d-xs-flex justify-content-end ${isNavOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav mb-2 mb-lg-0" >
                        <li className="nav-item px-1">
                            <Link style={{ color: type ? 'white' : 'black' }} className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Beranda</Link>
                        </li>
                        <li className="nav-item px-1">
                            <Link style={{ color: type ? 'white' : 'black' }} className={`nav-link ${location.pathname === '/informasi-desa' ? 'active underline' : ''}`} to="/informasi-desa">Informasi Desa</Link>
                        </li>
                        <li className="nav-item dropdown px-1">
                            <Link style={{ color: type ? 'white' : 'black' }} className={`nav-link ${location.pathname === '/kegiatan-program-desa' ? 'active underline' : ''}`} to="/kegiatan-program-desa">Kegiatan Desa</Link>
                        </li>
                        <li className="nav-item dropdown px-1">
                            <Link style={{ color: type ? 'white' : 'black' }} className={`nav-link ${location.pathname === '/portal-terintegrasi' ? 'active underline' : ''}`} to="/portal-terintegrasi">Portal Terintegrasi</Link>
                        </li>
                        {userData == null && (
                            <li className="nav-item px-1" style={{ borderLeft: '2px solid white' }}>
                                <Link className='nav-link' to="/login" >
                                    <div className="text-light wrap p-1 px-2" style={{ background: '#00917C', borderRadius: '0.5vw' }}>
                                        <img src={LoginIcon} className='me-2' alt="" />
                                        Login
                                    </div>
                                </Link>
                            </li>
                        )}
                        {userData != null && (
                            <>
                                <li className="nav-item dropdown">
                                    {userData.data?.role == 5 && (
                                        <Link style={{ color: type ? 'white' : 'black' }} className={`nav-link ${location.pathname === '/kades' ? 'active underline' : ''}`} to="/kades">Administrasi</Link>
                                    )}
                                </li>
                                <li className="nav-item dropdown">
                                    {userData.data?.role == 4 && (
                                        <Link style={{ color: type ? 'white' : 'black' }} className={`nav-link ${location.pathname === '/kasi' ? 'active underline' : ''}`} to="/kasi">Administrasi</Link>
                                    )}
                                </li>
                                <li className="nav-item dropdown">
                                    {userData.data?.role == 3 && (
                                        <Link style={{ color: type ? 'white' : 'black' }} className={`nav-link ${location.pathname === '/rw' ? 'active underline' : ''}`} to="/rw">Administrasi</Link>
                                    )}
                                </li>
                                <li className="nav-item dropdown">
                                    {userData.data?.role == 2 && (
                                        <Link style={{ color: type ? 'white' : 'black' }} className={`nav-link ${location.pathname === '/rt' ? 'active underline' : ''}`} to="/rt">Administrasi</Link>
                                    )}
                                </li>
                                <li className="nav-item dropdown">
                                    {userData.data?.role == 1 && (
                                        <Link style={{ color: type ? 'white' : 'black' }} className={`nav-link ${location.pathname === '/warga' ? 'active underline' : ''}`} to="/warga">Administrasi</Link>
                                    )}
                                </li>
                                {adminData?.admin &&
                                    (
                                        <li className="nav-item dropdown">
                                            <Link style={{ color: type ? 'white' : 'black' }} className={`nav-link ${location.pathname === '/dashboard-admin' ? 'active underline' : ''}`} to="/dashboard-admin">Administrasi</Link>
                                        </li>
                                    )
                                }
                                <li className="nav-item" style={{ borderLeft: '2px solid white' }}>
                                    <Link className='nav-link' to="/">
                                        <div className="text-light wrap p-1 px-2" style={{ background: '#00917C', borderRadius: '0.5vw' }}>
                                            <i className="fa-regular fa-user text-light me-2"></i>
                                            {userData?.data?.name ? userData.data.name : adminData?.admin?.name}
                                        </div>
                                    </Link>
                                </li>
                                {adminData?.admin ?
                                    <li className="nav-item dropdown px-1" onClick={handleLogoutAdmin}>
                                        <Link style={{ color: type ? 'white' : 'black' }} className="nav-link" to="/login-admin"><button className='btn btn-danger'>Logout</button></Link>
                                    </li>
                                    :
                                    <li className="nav-item dropdown px-1" onClick={handleLogout}>
                                        <Link style={{ color: type ? 'white' : 'black' }} className="nav-link" to="/login"><button className='btn btn-danger'>Logout</button></Link>
                                    </li>
                                }
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
