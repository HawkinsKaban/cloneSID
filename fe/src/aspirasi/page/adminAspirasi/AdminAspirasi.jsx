import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getToken from '../../../administration/pages/administration/shared/functions';
import NavBar from '../../../shared/layout/navBar';
import Footer from '../../../shared/layout/footer';

const AdminAspirasiPage = () => {
    const port = import.meta.env.VITE_BASE_API_URL3;
    const port2 = import.meta.env.VITE_BASE_API_URL;
    const port3 = import.meta.env.VITE_BASE_API_URL2;
    const [dataAdmin, setDataAdmin] = useState(null);
    const [dataAspirasi, setDataAspirasi] = useState([]);
    const [wargaNames, setWargaNames] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [selectedAspirasi, setSelectedAspirasi] = useState(null); 

    const id = getToken();

    const getAspirasi = async () => {
        try {
            const res = await axios.get(`${port}v1/aspirasi/getAspirasiAdmin`);
            if (res.data && res.data.length > 0) {
                setDataAspirasi(res.data);
                setIsLoading(false);
            } else {
                setDataAspirasi([]);
                setIsLoading(false);
            }
        } catch (err) {
            console.error(err);
            setIsError(true);
            setIsLoading(false);
        }
    };

    const cutString = (string) => {
        if (string.length > 20) {
            return string.substring(0, 20) + '...';
        }
        return string;
    };

    const tanggalFormat = (tanggal) => {
        const date = new Date(tanggal);
        return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getAdmin = async () => {
        try {
            const res = await axios.get(`${port2}v1/admin/get-admin/${id}`);
            setDataAdmin(res.data);
        } catch (err) {
            console.error(err);
            setIsError(true);
        }
    };

    const fetchWargaName = async (idWarga) => {
        if (!wargaNames[idWarga]) {
            try {
                const res = await axios.get(`${port3}v1/user/get/${idWarga}`);
                if (res.data && res.data.data && res.data.data.name) {
                    setWargaNames(prevNames => ({ ...prevNames, [idWarga]: res.data.data.name }));
                } else {
                    console.error(`Name not found for warga ID: ${idWarga}`);
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAspirasi();
            await getAdmin();
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (dataAspirasi.length > 0) {
            dataAspirasi.forEach(data => {
                fetchWargaName(data.wargaId);
            });
        }
    }, [dataAspirasi]);

    const handleRowClick = (aspirasi) => {
        setSelectedAspirasi(aspirasi);
    };

    const handleCloseModal = () => {
        setSelectedAspirasi(null);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Loading data failed.</div>;
    }

    return (
        <div className="container-fluid">
            <NavBar type={0} />
            <h1 className='my-2 my-md-5'>Aspirasi Page</h1>
            {dataAspirasi.length === 0 ? (
                <div>Belum ada data yang ditambahkan.</div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Aspirasi</th>
                            <th scope="col">Author</th>
                            <th scope="col">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataAspirasi.map((data, index) => (
                            <tr key={index} onClick={() => handleRowClick(data)}>
                                <td>{cutString(data.aspirasi)}</td>
                                <td>{wargaNames[data.wargaId] || 'Loading...'}</td>
                                <td>{tanggalFormat(data.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {selectedAspirasi && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Detail Aspirasi</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>{selectedAspirasi.aspirasi}</p>
                                <p>Author: {wargaNames[selectedAspirasi.wargaId]}</p>
                                <p>Tanggal: {tanggalFormat(selectedAspirasi.createdAt)}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer type="3" />
        </div>
    );
}

export default AdminAspirasiPage;
