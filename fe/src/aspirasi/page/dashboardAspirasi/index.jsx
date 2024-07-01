import { Fragment, useState, useEffect } from 'react';
import NavBar from '../../../shared/layout/navBar';
import Footer from '../../../shared/layout/footer';
import axios from 'axios';
import getToken from '../../../administration/pages/administration/shared/functions';
import './index.css';

const Aspirasi = () => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const port2 = import.meta.env.VITE_BASE_API_URL3;
    const [warga, setWarga] = useState([]);
    const [data, setData] = useState({
        aspirasi: '',
        isPublish: false,
        kategori: ''
    });

    const onChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const id = getToken();

    useEffect(() => {
        axios.get(`${port}v1/warga/get/${id}`)
            .then((res) => {
                setWarga(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    const validateForm = () => {
        if (!data.aspirasi) {
            alert('Aspirasi harus diisi');
            return false;
        }
        if (!data.kategori) {
            alert('Kategori harus dipilih');
            return false;
        }
        if (data.isPublish === undefined) {
            alert('Status harus dipilih');
            return false;
        }
        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            await axios.post(`${port2}v1/aspirasi/postAspirasi/${warga._id}`, data);
            alert('Aspirasi berhasil dikirim');
            setData({
                aspirasi: '',
                isPublish: false,
                kategori: ''
            });
        } catch (error) {
            console.error('Error posting aspirasi:', error);
            alert('Gagal mengirim aspirasi');
        }
    };

    const onRadioChange = (e) => {
        setData({ ...data, isPublish: e.target.value === 'true' });
    };

    return (
        <Fragment>
            <div className="container-fluid login-container p-0">
                <div className="container-fluid login-container-background p-0">
                    <NavBar type={1} />
                    <div className="row mt-0 mt-md-5">
                        <div className="col-1 col-md-2"></div>
                        <div className="col-10 col-md-8 mb-5">
                            <div className="card card-form-login pt-5">
                                <p className="text-center text-light" style={{ fontSize: '45px', fontWeight: 'bold' }}>ASPIRASI MASYARAKAT</p>
                                <p className="text-center text-light" style={{ fontSize: '20px' }}>Bangun desa wareng dengan saran dan masukan yang membangun demi kesejahteraan bersama</p>
                                <form onSubmit={onSubmit}>
                                    <div className="row">
                                        <div className="col-1"></div>
                                        <div className="col-10">
                                            <div className="mb-2">
                                                <p className="text-light mb-0" style={{ fontSize: '24px' }}>Aspirasi</p>
                                                <textarea
                                                    className="py-3 ps-3 text-dark"
                                                    style={{ width: '100%', borderRadius: '0.5vw' }}
                                                    placeholder="Masukkan Aspirasi Anda"
                                                    name="aspirasi"
                                                    value={data.aspirasi}
                                                    onChange={onChange}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <p className="text-light mb-0" style={{ fontSize: '24px' }}>Kategori</p>
                                                <select
                                                    className="form-select"
                                                    name="kategori"
                                                    value={data.kategori}
                                                    onChange={onChange}
                                                    style={{ borderRadius: '0.5vw', width: '100%' }}
                                                >
                                                    <option value="">Pilih Kategori</option>
                                                    <option value="Infrastruktur">Infrastruktur</option>
                                                    <option value="Pendidikan">Pendidikan</option>
                                                    <option value="Kesehatan">Kesehatan</option>
                                                    <option value="Kesejahteraan">Kesejahteraan</option>
                                                </select>
                                            </div>
                                            <div className="mb-2">
                                                <p className="text-light mb-0" style={{ fontSize: '24px' }}>Status</p>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        id="publish"
                                                        name="isPublish"
                                                        value={true}
                                                        checked={data.isPublish === true}
                                                        onChange={onRadioChange}
                                                    />
                                                    <label className="text-light" htmlFor="publish" style={{ marginLeft: '10px' }}>Publish</label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        id="private"
                                                        name="isPublish"
                                                        value={false}
                                                        checked={data.isPublish === false}
                                                        onChange={onRadioChange}
                                                    />
                                                    <label className="text-light" htmlFor="private" style={{ marginLeft: '10px' }}>Private</label>
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn mt-4 mb-3 mb-sm-5 text-light px-5 py-2"
                                                style={{ backgroundColor: '#00917C', fontSize: '24px', fontWeight: 'bold' }}
                                            >
                                                Kirim
                                            </button>
                                        </div>
                                        <div className="col-1"></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-1 col-md-1"></div>
                    </div>
                    <Footer type="2" />
                </div>
            </div>
        </Fragment>
    );
};

export default Aspirasi;
