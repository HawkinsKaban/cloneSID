

import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from "../../../../shared/layout/footer";
import Navbar from "../../../../shared/layout/navBar";
import getToken from '../shared/functions';
import PopUpDetailSurat from '../components/PopUpDetailSurat';
import ModalLengkapiDataUser from '../components/ModalLengkapiDataUser'; // Import ModalLengkapiDataUser

const RtPage = () => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const [DataRt, setDataRt] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [condition, setCondition] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [status, setStatus] = useState('loading');
    const [showLengkapiDataModal, setShowLengkapiDataModal] = useState(false); // State untuk ModalLengkapiDataUser

    const id = getToken();

    useEffect(() => {
        axios.get(`${port}v1/rt/getRt/${id}`)
            .then((res) => {
                setDataRt(res.data.data);
                setStatus('success');
            })
            .catch((err) => {
                console.error(err);
                setStatus('error');
            });
    }, [id]);

    const handleShowDetail = (surat) => {
        setSelectedSurat(surat);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSurat(null);
    };

    const renderTable = (data) => {
        const filteredData = data.filter(surat =>
            surat.nameAcara.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nama Acara</th>
                        <th>Jenis Surat</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((surat, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{surat.nameAcara}</td>
                            <td>{surat.jenisSurat}</td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        handleShowDetail(surat);
                                        setCondition(activeTab === 'pending');
                                    }}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const handleShowLengkapiDataModal = () => setShowLengkapiDataModal(true); // Show Lengkapi Data Modal
    const handleCloseLengkapiDataModal = () => setShowLengkapiDataModal(false); // Close Lengkapi Data Modal

    return (
        <>
            <div className="container-fluid">
                <Navbar className="" type={0}></Navbar>
                <h1 className='my-2 my-md-5'>Administrasi RT</h1>
                <button className="btn btn-primary" onClick={handleShowLengkapiDataModal}>
                    Lengkapi Data Diri
                </button>
                <div className="row mt-3">
                    <div className="col-12 col-md-6 mb-3">
                        <select
                            className="form-select"
                            aria-label="Select Category"
                            onChange={(e) => setActiveTab(e.target.value)}
                        >
                            <option value="pending">Surat Acara Menunggu Persetujuan</option>
                            <option value="approved">Surat Acara Disetujui</option>
                            <option value="rejected">Surat Acara Ditolak</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                {status === 'loading' && <p>Loading...</p>}
                {status === 'error' && <p>Data tidak berhasil dimuat.</p>}
                {status === 'success' && (
                    <>
                        {activeTab === 'pending' && DataRt.suratAcaraPending && (DataRt.suratAcaraPending.length > 0 ? renderTable(DataRt.suratAcaraPending) : <p>Tidak ada surat acara yang menunggu persetujuan</p>)}
                        {activeTab === 'approved' && DataRt.suratAcaraApproved && (DataRt.suratAcaraApproved.length > 0 ? renderTable(DataRt.suratAcaraApproved) : <p>Tidak ada surat acara yang disetujui</p>)}
                        {activeTab === 'rejected' && DataRt.suratAcaraRejected && (DataRt.suratAcaraRejected.length > 0 ? renderTable(DataRt.suratAcaraRejected) : <p>Tidak ada surat acara yang ditolak</p>)}
                    </>
                )}
                <Footer type={3}></Footer>
            </div>
            {showModal && (
                <PopUpDetailSurat
                    surat={selectedSurat}
                    handleCloseModal={handleCloseModal}
                    idTokoh={DataRt._id}
                    condition={condition}
                    role="rt"
                />
            )}
            <ModalLengkapiDataUser show={showLengkapiDataModal} handleClose={handleCloseLengkapiDataModal} userId={id} />
        </>
    );
};

export default RtPage;
