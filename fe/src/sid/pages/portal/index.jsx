import React, { useEffect, useState, Fragment } from 'react';
import Navbar from '../../../shared/layout/navBar';
import Footer from '../../../shared/layout/footer';
import './index.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import getSettings from '../../constant/carouselSertting';
import ImageError from '../../../assets/ImageErrorHandling.svg';
import axios from 'axios';


const Portal = () => {
    const port = import.meta.env.VITE_BASE_API_URL;
    const port2 = import.meta.env.VITE_BASE_API_URL4;
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('loading');
    const [slidesToShow, setSlidesToShow] = useState(3);

    const GetFromAPI = async () => {
        try {
            const response = await axios.get(`${port}v1/portal/get-portal`);
            const data = response.data.data.data;
            setData(data);
            setStatus('success');

            if (data.length === 1) {
                setSlidesToShow(1);
            } else if (data.length === 2) {
                setSlidesToShow(2);
            } else {
                setSlidesToShow(3);
            }
        } catch (error) {
            console.log(error.message);
            setStatus('error');
        }
    };

    useEffect(() => {
        GetFromAPI();
    }, []);

    return (
        <Fragment>
            <div className="container-fluid portal-container p-0">
                <div className="container-fluid portal-container-background pb-3 pb-md-0 p-0">
                    <Navbar type={0}></Navbar>
                    <h1 className='text-center pt-5 pb-2' style={{color: '#fff', fontSize : '30px'}}>Portal Web Pemerintah Daerah</h1>
                    {status === 'loading' && (
                        <p className="text-center mt-5">Loading...</p>
                    )}
                    {status === 'error' && (
                        <p className="text-center text-danger mt-5">Gagal memuat data.</p>
                    )}
                    {status === 'success' && data.length === 0 && (
                        <p className="text-center text-danger mt-5" style={{ backgroundColor: 'white' }}>Belum ada data yang ditambahkan.</p>
                    )}
                    {status === 'success' && data.length > 0 && (
                        <Slider {...getSettings(slidesToShow)}>
                            {data.map((item, index) => {
                                const imageSrc = `${port2}${encodeURIComponent(item.img)}`;
                                return (
                                    <div key={index}>
                                        <div className="card portal-card m-3 py-4 mx-2" style={{ borderRadius: '1vw', border: '1px solid #00917C', transition: 'transform 0.3s ease' }}>
                                            <div className="row">
                                                <div className="col-1"></div>
                                                <div className="col-10">
                                                    <img src={imageSrc} alt="" className='mx-auto' style={{ width: "100%", borderRadius: '2vh' }} onError={(e) => { e.target.src = ImageError; }} />
                                                    <p className='py-2' style={{ fontSize: '24px' }}>{item.title}</p>
                                                    <p className='text-dark' style={{ textAlign: 'justify' }}>{item.isi}</p>
                                                    <a href={item.content}>Baca lebih banyak</a>
                                                </div>
                                                <div className="col-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    )}
                    <Footer type={3}></Footer>
                </div>
            </div>
        </Fragment>
    );
}

export default Portal;
