import { Fragment, useState, useEffect } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import ImageError from '../../../../../assets/ImageErrorHandling.svg';
import Setting from '../../../../constant/carouselSertting2';

const PerangkatDesa = () => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const port2 = import.meta.env.VITE_BASE_API_URL5;
    const [data, setData] = useState([]);
    const [dataKades, setDataKades] = useState([]);
    const [status, setStatus] = useState('loading');

    const GetFromAPI = async () => {
        setStatus('loading');
        try {
            const response = await axios.get(`${port}v1/perangkatDesa/get`);
            const response2 = await axios.get(`${port}v1/pimpinanDesa/get`);
            setData(response.data.data);
            setDataKades(response2.data.data);
            setStatus('success');
        } catch (error) {
            console.log(error.message);
            setStatus('error');
        }
    };

    const roleToString = (role) => {
        switch (role) {
            case 1:
                return 'Warga';
            case 2:
                return 'RW';
            case 3:
                return 'RT';
            case 4:
                return 'Perangkat Desa';
            case 5:
                return 'Kepala Desa';
            default:
                return 'Unknown';
        }
    };

    useEffect(() => {
        GetFromAPI();
    }, []);

    return (
        <Fragment>
            <div className="container-fluid perangkat-desa-container mb-0 mb-md-5">
                <p>Perangkat Desa</p>
                {status === 'loading' && <p>Loading...</p>}
                {status === 'error' && <p>Data tidak berhasil dimuat.</p>}
                {status === 'success' && data.length === 0 &&(
                    <p>Belum ada data yang ditambahkan</p>
                )}
                {status === 'success' && data.length > 0 && (
                    <Slider {...Setting}>
                    {dataKades.map((item, index) => {
                        const imageSrc = `${port2}${encodeURIComponent(item?.user?.img[0])}`;
                        return (
                            <div key={index}>
                                <div className="card perangkat-desa-card mx-2" style={{ borderRadius: '1vw', border: '1px solid #00917C', transition: 'transform 0.3s ease', minWidth: '30vw' }}>
                                    <div className="row p-0">
                                        <div className="col-5 p-0">
                                            <img src={imageSrc} alt="" className="img-fluid" style={{ height: '150px', marginLeft: '12px', borderTopLeftRadius: '1vw', borderBottomLeftRadius: '1vw' }} onError={(e) => { e.target.src = ImageError; }} />
                                        </div>
                                        <div className="col-6 p-0">
                                            <div className="content p-2" style={{ marginLeft: '12px' }}>
                                                <p className="p-0 m-0 mt-1 mt-md-2 " style={{ fontFamily: 'poppins', fontWeight: 'bold', fontSize: '20px' }}>{item.user.name}</p>
                                                <p className="p-0 m-0 mt-1 mt-md-2 " style={{ fontFamily: 'poppins', fontWeight: 'bold', fontSize: '16px', textAlign: 'justify' }}>{item.user.nohp}</p>
                                                <p className="p-0 m-0 mt-1 mt-md-2 " style={{ fontFamily: 'poppins', fontWeight: 'bold', fontSize: '16px', textAlign: 'justify' }}>{item.user.alamat}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {data.map((item, index) => {
                        const imageSrc = `${port2}${encodeURIComponent(item.user.img)}`;
                        return (
                            <div key={index}>
                                <div className="card perangkat-desa-card mx-2" style={{ borderRadius: '1vw', border: '1px solid #00917C', transition: 'transform 0.3s ease', minWidth: '30vw' }}>
                                    <div className="row p-0">
                                        <div className="col-5 p-0">
                                            <img src={imageSrc} alt="" className="img-fluid" style={{ height: '150px', marginLeft: '12px', borderTopLeftRadius: '1vw', borderBottomLeftRadius: '1vw' }} onError={(e) => { e.target.src = ImageError; }} />
                                        </div>
                                        <div className="col-6 p-0">
                                            <div className="content p-2" style={{ marginLeft: '12px' }}>
                                                <p className="p-0 m-0 mt-1 mt-md-2 " style={{ fontFamily: 'poppins', fontWeight: 'bold', fontSize: '20px' }}>{item.user.name}</p>
                                                <p className="p-0 m-0 mt-1 mt-md-2 " style={{ fontFamily: 'poppins', fontWeight: 'bold', fontSize: '16px', textAlign: 'justify' }}>{item.user.nohp}</p>
                                                <p className="p-0 m-0 mt-1 mt-md-2 " style={{ fontFamily: 'poppins', fontWeight: 'bold', fontSize: '16px', textAlign: 'justify' }}>{item.user.alamat}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </Slider>
                )}
            </div>
        </Fragment>
    );
}

export default PerangkatDesa;
