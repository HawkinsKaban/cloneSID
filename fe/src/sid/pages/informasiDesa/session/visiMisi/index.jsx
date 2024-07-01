import React, { Fragment, useEffect, useState } from "react";
import axios from 'axios';

const VisiMisi = () => {
    const Port = import.meta.env.VITE_BASE_API_URL;
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('loading');

    const getFromAPI = async () => {
        setStatus('loading');
        try {
            const response = await axios.get(`${Port}v1/visi-misi/get-visi-misi`);
            setData(response.data.data);
            setStatus('success');
        } catch (error) {
            console.log(error.message);
            setStatus('error');
        }
    };

    useEffect(() => {
        getFromAPI();
    }, []);

    return (
        <Fragment>
            <div className="container-fluid visi-misi-container py-4 px-5 mb-0 mb-md-5" style={{ backgroundColor: '#00917C', borderRadius: '2vw' }}>
                {status === 'loading' && <p style={{ color: 'white' }}>Loading...</p>}
                {status === 'error' && <p style={{ color: 'white' }}>Data tidak dapat ditampilkan.</p>}
                {status === 'success' && data.length === 0 && (
                    <p>Belum ada data yang ditambahkan</p>
                )}
                {status === 'success' && data.length > 0 && (
                    <>
                        <p style={{ color: 'white', fontSize: '48px', fontWeight: 'bold' }}>Visi</p>
                        <p style={{ color: 'white', fontSize: '20px', textAlign: 'justify' }}>{data.length > 0 ? data[0]?.visi : 'Data tidak dapat ditampilkan'}</p>
                        <p style={{ color: 'white', fontSize: '48px', fontWeight: 'bold' }}>Misi</p>
                        <p style={{ color: 'white', fontSize: '20px', textAlign: 'justify' }}>{data.length > 0 ? data[0]?.misi : 'Data tidak dapat ditampilkan'}</p>
                    </>
                )}
            </div>
        </Fragment>
    );
}

export default VisiMisi;
