import React, { Fragment, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Footer from "../../../shared/layout/footer";
import Navbar from "../../../shared/layout/navBar";
import axios from 'axios';
import ImageError from '../../../assets/ImageErrorHandling.svg';


const DetailKegiatanDesa = () => {
    const port = import.meta.env.VITE_BASE_API_URL;
    const port2 = import.meta.env.VITE_BASE_API_URL4;
    const [SM, setSM] = useState(window.innerWidth <= 768);
    const [data, setData] = useState({});
    const [status, setStatus] = useState('loading');
    const { id } = useParams();

    const GetFromAPI = async () => {
        setStatus('loading');
        try {
            const response = await axios.get(`${port}v1/kegiatan/get-kegiatan/${id}`);
            setData(response.data.data);
            setStatus('success');
        } catch (error) {
            console.log(error.message);
            setStatus('error');
        }
    };

    const formatDate = (date) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day} ${months[monthIndex]} ${year}`;
    };

    useEffect(() => {
        GetFromAPI();
    }, [id]);

    useEffect(() => {
        const handleResize = () => {
            setSM(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Fragment>
            <div className="container-fluid informasi-desa-container p-0" style={{ overflow: 'hidden' }}>
                <Navbar type={0}></Navbar>
                <div className="background-hijau p-0 m-0" style={{ position: 'absolute', width: '100%', height: SM ? '270px' : '300px', background: '#00917C', zIndex: '-1' }}></div>
                <div className="row p-0">
                    <div className="col-0 col-md-1"></div>
                    <div className="col-12 col-md-10 text-center">
                        <p className="pt-4" style={{ fontSize: '16px', color: 'white' }}>Desa Wareng</p>
                        <p style={{ fontSize: '36px', fontWeight: 'lighter', color: 'white' }}>Agenda <span style={{ fontWeight: 'bold', color: 'white' }}>Desa</span></p>
                        {status === 'loading' && (
                            <p>Loading...</p>
                        )}
                        {status === 'error' && (
                            <p>Data tidak dapat dimuat.</p>
                        )}
                        {status === 'success' && !data && (
                            <p>Belum ada data yang ditambahkan</p>
                        )}
                        {status === 'success' && data && (
                            <>
                                <div className="wrap-img p-4">
                                    <div className="py-4 mx-auto" style={{ width: '75%', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '1vw' }}>
                                        <div className="mx-auto" style={{ maxWidth: '622px', maxHeight: '266px' }}>
                                            <img src={data.img && data.img.length > 0 ? `${port2}${encodeURIComponent(data.img[0])}` : ImageError} alt="" style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '1vw' }} onError={(e) => e.target.src = ImageError} />
                                        </div>
                                    </div>
                                </div>
                                <p className="pt-3" style={{ fontSize: '48px', fontWeight: 'bold' }}>{data.title}</p>
                                <div className="row">
                                    <div className="col-1 col-md-0"></div>
                                    <div className="col-10 col-md-12">
                                        <p style={{ fontSize: '20px', textAlign: 'justify' }}>{data.content}</p>
                                        <div className="row mt-5">
                                            <div className="col-12 col-md-2">
                                                <p style={{ fontSize: '20px', fontWeight: '500', textAlign: 'left', borderBottom: '5px solid #00917C' }}>Jam</p>
                                                <p style={{ fontSize: '16px', textAlign: 'left' }}>{new Date(data.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div className="col-12 col-md-2 "></div>
                                            <div className="col-12 col-md-3">
                                                <p style={{ fontSize: '20px', fontWeight: '500', textAlign: 'left', borderBottom: '5px solid #00917C' }}>Lokasi</p>
                                                <p style={{ fontSize: '16px', textAlign: 'left' }}>{data.location}</p>
                                            </div>
                                            <div className="col-12 col-md-2"></div>
                                            <div className="col-12 col-md-3">
                                                <p style={{ fontSize: '20px', fontWeight: '500', textAlign: 'left', borderBottom: '5px solid #00917C' }} >Tanggal</p>
                                                <p style={{ fontSize: '16px', textAlign: 'left' }}>{formatDate(new Date(data.date))}</p>
                                            </div>
                                        </div>
                                        {data.img && data.img.length > 1 && (
                                            <div className="row mt-5">
                                                <div className="col-12">
                                                    <p style={{ fontSize: '20px', fontWeight: '500', textAlign: 'left', borderBottom: '5px solid #00917C' }}>Gambar Terkait</p>
                                                    <div className="d-flex flex-wrap">
                                                        {data.img.slice(1).map((img, index) => (
                                                            <div key={index} className="p-2" style={{ flex: '1 0 21%', margin: '5px' }}>
                                                                <img src={`${port2}${encodeURIComponent(img)}`} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '1vw' }} onError={(e) => e.target.src = ImageError} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-1 col-md-0"></div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="col-0 col-md-1"></div>
                </div>
                <Footer type={3}></Footer>
            </div>
        </Fragment >
    )
}

export default DetailKegiatanDesa;
