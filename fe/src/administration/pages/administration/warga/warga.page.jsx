import { useState, useEffect } from 'react';
import axios from 'axios';
import getToken from '../shared/functions';
import DetailSuratWarga from '../components/detailSuratWarga';
import Footer from "../../../../shared/layout/footer";
import Navbar from "../../../../shared/layout/navBar";

import FormPencatatanKependudukan from '../components/formSubSuratPerizinan/form_pencatatanKependudukan';
import FormSuratKuasaAktaKematian from '../components/formSubSuratPerizinan/form_suratKuasaAktaKematian';
import FormSuratIzinBepergian from '../components/formSubSuratPerizinan/form_SuratIzinBepergian';
import FormSuratIzinKeramaian from '../components/formSubSuratPerizinan/form_SuratIzinKeramaian';
import FormSuratKeteranganKelahiran from '../components/formSubSuratPerizinan/form_SuratKeteranganKelahiran';
import FormSuratSKCK from '../components/formSubSuratPerizinan/form_SuratSKCK';
import FormSuratBantuanSosial from '../components/formSubSuratPerizinan/form_SuratBantuanSosial';
import FormSuratKeteranganNikah from '../components/formSubSuratPerizinan/form_SuratKeteranganNikah';

import ModalLengkapiDataUser from '../components/ModalLengkapiDataUser'; // Import ModalLengkapiDataUser

const WargaPage = () => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const port2 = import.meta.env.VITE_BASE_API_URL3;
    const [showModal, setShowModal] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [DataWarga, setDataWarga] = useState({});
    const [DataAspirasi, setDataAspirasi] = useState([]);
    const [statusSurat, setStatusSurat] = useState('loading');
    const [statusAspirasi, setStatusAspirasi] = useState('loading');
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const [searchQuerySurat, setSearchQuerySurat] = useState('');
    const [searchQueryAspirasi, setSearchQueryAspirasi] = useState('');
    const [showLengkapiDataModal, setShowLengkapiDataModal] = useState(false); // State untuk ModalLengkapiDataUser
    const id = getToken();
    const [idWarga, setIdWarga] = useState('')

    const GetDataWarga = async () => {
        try {
            const response = await axios.get(`${port}v1/warga/get/${id}`);
            setDataWarga(response.data.data);
            setIdWarga(response.data.data._id)
            setStatusSurat('success');
        } catch (error) {
            console.error('Error getting data warga:', error);
            setStatusSurat('error');
        }
    };

    const GetDataAspirasiWarga = async () => {
        try {
            const response = await axios.get(`${port2}v1/aspirasi/getAspirasi/${idWarga}`);
            setDataAspirasi(response.data.data);
            setStatusAspirasi('success');
        } catch (error) {
            console.error('Error getting data aspirasi:', error);
            setStatusAspirasi('error');
        }
    };

    const aspirasiDecider = (isPublish) => {
        return isPublish ? 'Untuk umum' : 'Untuk kades';
    }

    const pengajuanStatusDecider = (isPending) => {
        return isPending ? 'Pending' : 'Selesai';
    }

    useEffect(() => {
        GetDataWarga();
        if(idWarga){
            GetDataAspirasiWarga();
        }
    }, [idWarga]);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedForm(null);
    };
    const handleShowDetail = (surat) => {
        setSelectedSurat(surat);
        setShowDetail(true);
    };
    const handleCloseDetail = () => setShowDetail(false);

    const handleDownloadPdf = async (idSuratAcara, nameAcara) => {
        console.log('idSuratAcara:', idSuratAcara);
        console.log('nameAcara:', nameAcara);
        try {
            const response = await axios.get(`${port}v1/surat/get/generatePdf/${idSuratAcara}`, {
                responseType: 'blob',
            });

            if (response.status !== 200) {
                throw new Error(`Failed to download PDF. Status code: ${response.status}`);
            }

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Surat_${nameAcara}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error downloading pdf:', err);
        }
    };

    const filteredSuratAcara = DataWarga.suratAcara?.filter(surat =>
        surat.jenisSurat.toLowerCase().includes(searchQuerySurat.toLowerCase())
    );

    const filteredAspirasi = DataAspirasi.filter(aspirasi =>
        aspirasi.aspirasi.toLowerCase().includes(searchQueryAspirasi.toLowerCase())
    );

    const handleShowLengkapiDataModal = () => setShowLengkapiDataModal(true); // Show Lengkapi Data Modal
    const handleCloseLengkapiDataModal = () => setShowLengkapiDataModal(false); // Close Lengkapi Data Modal

    return (
        <>
            <div className="container-fluid">
                <Navbar className="" type={0}></Navbar>
                <h1 className='my-2 my-md-5'>Administrasi Warga</h1>
                <div className="d-flex">
                    <button className="btn btn-primary me-1" onClick={handleShowLengkapiDataModal}>
                        Lengkapi Data Diri
                    </button>
                    <button className="btn btn-primary ms-1" onClick={handleShowModal}>
                        Tampilkan Form Perizinan Surat
                    </button>
                </div>

                <div className="mt-4">
                    <h3>Surat Acara</h3>
                    <input
                        type="text"
                        placeholder="Search Surat Acara"
                        value={searchQuerySurat}
                        onChange={(e) => setSearchQuerySurat(e.target.value)}
                        className="form-control mb-3"
                    />
                    {statusSurat === 'loading' && <p>Loading...</p>}
                    {statusSurat === 'error' && <p>Data tidak berhasil dimuat.</p>}
                    {statusSurat === 'success' && filteredSuratAcara && filteredSuratAcara.length > 0 ? (
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Jenis Surat</th>
                                    <th>Status Acara</th>
                                    <th>Status Persetujuan</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSuratAcara.map((surat, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{surat.jenisSurat}</td>
                                        <td>{surat.statusAcara}</td>
                                        <td>{surat.statusPersetujuan}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleShowDetail(surat)}
                                            >
                                                View
                                            </button>
                                            {/* ini di hilangkan dulu */}
                                            <button 
                                                className="btn btn-secondary ms-2 d-none"
                                                onClick={() => handleDownloadPdf(surat._id, surat.nameAcara)}
                                            >
                                                Download PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>Belum ada surat acara</p>}
                </div>

                <div className="mt-4">
                    <h3>Aspirasi</h3>
                    <input
                        type="text"
                        placeholder="Search Aspirasi"
                        value={searchQueryAspirasi}
                        onChange={(e) => setSearchQueryAspirasi(e.target.value)}
                        className="form-control mb-3"
                    />
                    {statusAspirasi === 'loading' && <p>Loading...</p>}
                    {statusAspirasi === 'error' && <p>Data tidak berhasil dimuat.</p>}
                    {statusAspirasi === 'success' && filteredAspirasi.length > 0 ? (
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Aspirasi</th>
                                    <th>Status</th>
                                    <th>Status Pengajuan</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAspirasi.map((aspirasi, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{aspirasi.aspirasi}</td>
                                        <td>{aspirasiDecider(aspirasi.isPublish)}</td>
                                        <td>{pengajuanStatusDecider(aspirasi.isPending)}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleShowDetail(aspirasi)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>Belum ada aspirasi</p>}
                </div>

                <ModalLengkapiDataUser show={showLengkapiDataModal} handleClose={handleCloseLengkapiDataModal} userId={id} />

                <div className="modal" tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Form Perizinan Surat</h5>
                                <button type="button" className="close" onClick={handleCloseModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {selectedForm === null && (
                                    <div 
                                        className="d-flex flex-column justify-content-center align-items-center"
                                        style={{ height: '50vh' }}
                                    >
                                        <button className="btn btn-primary my-1" onClick={() => setSelectedForm('FormPencatatanKependudukan')}>Form Pencatatan Kependudukan</button>
                                        <button className="btn btn-primary my-1" onClick={() => setSelectedForm('FormSuratKuasaAktaKematian')}>Form Surat Kuasa Akta Kematian</button>
                                        <button className="btn btn-primary my-1" onClick={() => setSelectedForm('FormSuratIzinBepergian')}>Form Surat Izin Bepergian</button>
                                        <button className="btn btn-primary my-1" onClick={() => setSelectedForm('FormSuratIzinKeramaian')}>Form Surat Izin Keramaian</button>  
                                        <button className = "btn btn-primary my-1" onClick = {() => setSelectedForm('FormSuratKeteranganKelahiran')}> Form Surat Keterangan Kelahiran </button> 
                                        <button className = "btn btn-primary my-1" onClick = {() => setSelectedForm('FormSuratSKCK')}> Form Surat SKCK </button>
                                        <button className = "btn btn-primary my-1" onClick = {() => setSelectedForm('FormSuratBantuanSosial')}> Form Surat Bantuan Sosial </button>
                                        <button className = "btn btn-primary my-1" onClick = {() => setSelectedForm('FormSuratKeteranganNikah')}> Form Surat Keterangan Nikah </button>
                                    </div>
                                )}

                                {selectedForm === 'FormPencatatanKependudukan' && (
                                    <FormPencatatanKependudukan handleCloseModal={handleCloseModal} />
                                )}
                                {selectedForm === 'FormSuratKuasaAktaKematian' && (
                                    <FormSuratKuasaAktaKematian handleCloseModal={handleCloseModal} />
                                )}
                                {selectedForm === 'FormSuratIzinBepergian' && (
                                    <FormSuratIzinBepergian handleCloseModal={handleCloseModal} />
                                )}
                                {selectedForm === 'FormSuratIzinKeramaian' && (
                                    <FormSuratIzinKeramaian handleCloseModal={handleCloseModal} />
                                )}
                                {selectedForm === 'FormSuratKeteranganKelahiran' && (
                                    <FormSuratKeteranganKelahiran handleCloseModal={handleCloseModal} />
                                )}
                                {selectedForm === 'FormSuratSKCK' && (
                                    <FormSuratSKCK handleCloseModal={handleCloseModal} />
                                )}
                                {selectedForm === 'FormSuratBantuanSosial' && (
                                    <FormSuratBantuanSosial handleCloseModal={handleCloseModal} />
                                )}
                                {selectedForm === 'FormSuratKeteranganNikah' && (
                                    <FormSuratKeteranganNikah handleCloseModal={handleCloseModal} />
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {showDetail && (
                    <DetailSuratWarga
                        surat={selectedSurat}
                        handleCloseModal={handleCloseDetail}
                    />
                )}
                <Footer type={3}></Footer>
            </div>
        </>
    );
};

export default WargaPage;
