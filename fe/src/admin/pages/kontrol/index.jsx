import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import ModalTambahUser from './component/modal_add_user';
import ModalTambahRt from './component/modal_add_rt';
import ModalTambahRw from './component/modal_add_rw'; 
import ModalTambahPd from './component/modal_add_pd';
import ModalTambahKades from './component/modal_add_kades';


const KontrolPengguna = () => {
    const [totalData, setTotalData] = useState({});
    const [totalSurat, setTotalSurat] = useState({});
    const [showModalUser, setShowModalUser] = useState(false);
    const [showModalRt, setShowModalRt] = useState(false); 
    const [showModalRw, setShowModalRw] = useState(false);
    const [showModalPd, setShowModalPd] = useState(false);
    const [showModalKades, setShowModalKades] = useState(false);


    const countUser = async () => {
        try {
            const response = await axios.get('http://localhost:3555/api/v1/admin/count-all-document');
            setTotalData(response.data); 
        } catch (error) {
            console.error(error);
        }
    };

    const countsuratAdministrasi = async () => {
        try {
            const response = await axios.get('http://localhost:3555/api/v1/admin/count-all-surat-acara');
            setTotalSurat(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        countUser();
        countsuratAdministrasi();
    }, []);

    const handleShowUserModal = () => setShowModalUser(true);
    const handleCloseUserModal = () => setShowModalUser(false);
    const handleShowRtModal = () => setShowModalRt(true); 
    const handleCloseRtModal = () => setShowModalRt(false);
    const handleShowRwModal = () => setShowModalRw(true);
    const handleCloseRwModal = () => setShowModalRw(false);
    const handleShowPdModal = () => setShowModalPd(true);
    const handleClosePdModal = () => setShowModalPd(false);
    const handleShowKadesModal = () => setShowModalKades(true);
    const handleCloseKadesModal = () => setShowModalKades(false);

    return (
        <>
        <div className="container-fluid">

        
            <h1 className='my-2 my-md-5'>Daftar Portal</h1>
            <div className="container p-3">
                <div className="row justify-content-between">
                    {[
                        { label: 'User', value: totalData.totalUser },
                        { label: 'Rt', value: totalData.totalRt },
                        { label: 'Rw', value: totalData.totalRw },
                        { label: 'Perangkat Desa', value: totalData.totalPerangkatDesa },
                        { label: 'Kades', value: totalData.totalPimpinanDesa },
                        { label: 'Surat Administrasi', value: totalSurat.totalSurat }
                    ].map((item, index) => (
                        <div className="col-12 col-md-4 mb-3" key={index}>
                            <div className="p-3" style={{
                                backgroundColor: '#DCFFFA',
                                padding: '10px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center'
                            }}>
                                <p className="mb-1" style={{ fontWeight: 'bold' }}>{item.label}</p>
                                <p style={{ fontSize: '1.5rem' }}>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="container p-4 mx-2 d-flex justify-content-around align-items-center" style={{
                borderTop: '1px solid #DCFFFA',
                backgroundColor: '#DCFFFA',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '30px'
            }}>
                <Button variant="primary" className="btn-lg mx-1" onClick={handleShowUserModal}>
                    Tambah User
                </Button>
                <Button variant="primary" className="btn-lg mx-1" onClick={handleShowRtModal}>
                    Tambah RT
                </Button>
                <Button variant="primary" className="btn-lg mx-1" onClick={handleShowRwModal}>
                    Tambah RW
                </Button>
                <Button variant="primary" className="btn-lg mx-1" onClick={handleShowPdModal}>
                    Tambah Perangkat Desa
                </Button>
                <Button variant="primary" className="btn-lg mx-1" onClick={handleShowKadesModal}>
                    Tambah Kades
                </Button>
            </div>


            <ModalTambahUser show={showModalUser} handleClose={handleCloseUserModal} />
            <ModalTambahRt show={showModalRt} handleClose={handleCloseRtModal} /> 
            <ModalTambahRw show={showModalRw} handleClose={handleCloseRwModal} />
            <ModalTambahPd show={showModalPd} handleClose={handleClosePdModal} />
            <ModalTambahKades show={showModalKades} handleClose={handleCloseKadesModal} />
            </div>
        </>
    );
};

export default KontrolPengguna;
