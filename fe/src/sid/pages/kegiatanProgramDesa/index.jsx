import React, { Fragment, useState, useEffect } from "react";
import Footer from "../../../shared/layout/footer";
import Navbar from "../../../shared/layout/navBar";
import { Link } from "react-router-dom";
import axios from 'axios';
import ImageError from '../../../assets/ImageErrorHandling.svg';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Logo from '../../../assets/LogoWareng.svg';


const KegiatanProgramDesa = () => {
    const port = import.meta.env.VITE_BASE_API_URL;
    const port2 = import.meta.env.VITE_BASE_API_URL4;
    const [data, setData] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [status, setStatus] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const GetFromAPI = async () => {
        setStatus('loading');
        try {
            const response = await axios.get(`${port}v1/kegiatan/get-kegiatan`);
            setData(response.data.data.data);
            setStatus('success');
        } catch (error) {
            console.log(error.message);
            setStatus('error');
        }
    };

    const formatDate = (date) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const dayName = days[date.getDay()];
        return `${day < 10 ? '0' + day : day} ${months[monthIndex]} ${year}, ${dayName}`;
    };

    const handleReset = async () => {
        setSelectedDate(null);
        setSearchName('');
        GetFromAPI();
    };

    const handleSearch = async () => {
        setStatus('loading');
        try {
            let response;
            if (searchName === '' && selectedDate != null) {
                response = await axios.get(`${port}v1/kegiatan/get-kegiatan/-1/${selectedDate}`);
            } else if (searchName !== '' && selectedDate == null) {
                response = await axios.get(`${port}v1/kegiatan/get-kegiatan/${searchName}/-1`);
            } else {
                response = await axios.get(`${port}v1/kegiatan/get-kegiatan/${searchName}/${selectedDate}`);
            }
            setData(response.data.data);
            setStatus('success');
        } catch (error) {
            console.log(error.message);
            setStatus('error');
        }
    };

    useEffect(() => {
        GetFromAPI();
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Fragment>
            <Navbar type={0}></Navbar>
            <div className="container-fluid informasi-desa-container" style={{ overflow: 'hidden ', background: '#F7FFFB' }}>
                <div className="row">
                    <div className="col-0 col-md-1"></div>
                    <div className="col-12 col-md-10">
                        <p className="pt-3 pt-md-5" style={{ fontSize: '40px', fontWeight: 'bold' }}>KEGIATAN PROGRAM DESA WARENG</p>
                        <div className="d-block d-md-flex justify-content-between">
                            <div className="d-flex align-items-center">
                                <p style={{ fontSize: '64px', fontWeight: '600' }}>{currentDate.getDate()}</p>
                                <div>
                                    <p className="m-0" style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentDate.toLocaleDateString('id-ID', { weekday: 'long' })}</p>
                                    <p style={{ fontSize: '12px' }}>{currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                                <img src={Logo} alt="logo" className="pb-3" style={{ marginRight: '10px' }} />
                                <p style={{ fontSize: '64px' }}>21</p>
                                <div>
                                    <p className="m-0" style={{ fontSize: '20px', fontWeight: 'bold' }}>YOGYAKARTA</p>
                                    <p style={{ fontSize: '12px' }}>INDONESIA</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-center" style={{ color: '#184D47', fontSize: '36px', fontWeight: 'bold' }}>Agenda Desa</p>
                        <div className="row my-5 p-3" style={{ boxShadow: '1px 4px 6px rgba(0, 145, 124, 1)', border: '1px solid #00917C', borderRadius: '1vw', background: 'white' }}>
                            <div className="col-12 col-md-4 mb-2 mb-md-0" style={{ borderRight: '2px solid #00917C' }}>
                                <p>Nama Desa</p>
                                <input
                                    className="py-3 px-1"
                                    type="text"
                                    placeholder="search by name"
                                    style={{ border: '1px solid gray', borderRadius: '0.3vw', width: 'max-content' }}
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-md-4 mb-2 mb-md-0" style={{ borderRight: '2px solid #00917C' }}>
                                <p>Pilih Tanggal</p>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="col-12 col-md-4" style={{ margin: 'auto' }}>
                                <button className="btn btn-success me-3" onClick={handleSearch}>Pencarian</button>
                                <button className="btn btn-success" onClick={handleReset}>Reset</button>
                            </div>
                        </div>
                        {status === 'loading' && <p className="text-center">Loading...</p>}
                        {status === 'error' && <p className="text-center text-danger">Data tidak berhasil ditampilkan.</p>}
                        {status === 'success' && data && data.length > 0 ? (
                            <div className="row">
                                {data && Array.isArray(data) && data.map((item, index) => {
                                    const imageSrc = `${port2}${encodeURIComponent(item.img[0])}`;
                                    return (
                                        <div className="col-12 col-md-6 mb-5" style={{ position: 'relative' }} key={index}>
                                            <div>
                                                <img src={imageSrc} alt="" style={{ height: '250px', width: '100%', maxHeight: '100%', borderRadius: '1vw' }} onError={(e) => { e.target.src = ImageError; }} />
                                                <Link to={`/detail-kegiatan-desa/${item._id}`}>
                                                    <button className="btn text-light" style={{ position: 'absolute', bottom: '200px', right: '10%', fontSize: '14px', background: '#00917C' }}>Lihat selengkapnya</button>
                                                </Link>
                                            </div>
                                            <p className="pt-0 pt-md-4" style={{ fontSize: '20px', fontWeight: 'bold' }}>{item.title}</p>
                                            <div className="row">
                                                <div className="col-12 col-md-6 d-flex">
                                                    <i className="fa-regular fa-clock me-1"></i>
                                                    <p style={{ fontSize: '14px' }}>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div className="col-12 col-md-6 d-flex">
                                                    <i className="fa-solid fa-location-dot me-1"></i>
                                                    <p style={{ fontSize: '14px' }}>{item.location}</p>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 d-flex">
                                                <i className="fa-regular fa-calendar me-1"></i>
                                                <p style={{ fontSize: '14px' }}>{formatDate(new Date(item.date))}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center">Belum ada data yang ditambahkan.</div>
                        )}
                    </div>
                    <div className="col-0 col-md-1"></div>
                </div>
            </div>
            <Footer type={3}></Footer>
        </Fragment>
    );
};

export default KegiatanProgramDesa;
