import { Fragment, useState, useEffect } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import axios from 'axios';
import getSettings from '../../../../constant/carouselSertting';


const AspirasiDesa = () => {
    const port = import.meta.env.VITE_BASE_API_URL3;
    const [data, setData] = useState([]);
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [status, setStatus] = useState('');

    const GetFromAPI = async () => {
        setStatus('loading');
        try {
            const response = await axios.get(`${port}v1/aspirasi/getAspirasiApproved`);
            var data = response.data;
            if (data.length > 10) {
                data = data.slice(0, 10);
            }
            setData(data);

            if (data.length === 1) {
                setSlidesToShow(1);
            } else if (data.length === 2) {
                setSlidesToShow(2);
            } else {
                setSlidesToShow(3);
            }
            setStatus('success');
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
            <div className="container-fluid aspirasi-desa-container mb-0 mb-md-5">
                <p>Aspirasi Desa</p>
                {status === 'loading' && <p>Loading...</p>}
                {status === 'error' && <p>Data tidak berhasil dimuat.</p>}
                {status === 'success' && data.length === 0 && (
                    <p>Belum ada data yang ditambahkan</p>
                )}
                {status === 'success' && data.length > 0 && (
                    <div class="row">
                        <Slider {...getSettings(slidesToShow)}>
                            {data.map((item, index) => (
                                <div key={index}>
                                    <div class="card aspirasi-desa-card m-3 py-4 px-2">
                                        <p style={{ fontFamily: 'poppins', fontWeight: 'bold', fontSize: '20px' }}>{item.aspirasi}</p>
                                        <p style={{ fontFamily: 'poppins', fontSize: '16px', textAlign: 'justify' }}>{item.kategori}</p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}
            </div>
        </Fragment>
    )
}

export default AspirasiDesa;
