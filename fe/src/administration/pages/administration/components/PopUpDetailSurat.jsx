import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import BypassSurat from './bypassSurat';
import axios from 'axios';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

const PopUpDetailSurat = ({ surat, jenisSurat, handleCloseModal, idTokoh, role, activeTab, refreshData }) => {

    const handlePersetujuanSurat = async (statusPersetujuan) => {
        try {
            const request = await axios.put(`http://localhost:3555/api/v1/surat/persetujuan-surat-acara-${role}/${idTokoh}/${surat._id}`, {
                statusPersetujuanReq: statusPersetujuan
            });
            console.log(request);
            refreshData();
            handleCloseModal();
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    const handlePersetujuanAspirasi = async (statusPersetujuan) => {
        try {
            const update = {
                siApproved: statusPersetujuan,
                isPending: false
            };

            const request = await axios.put(`http://localhost:3557/api/v1/aspirasi/updateAspirasi/${surat._id}`, update);
            console.log(request);
            refreshData(); 
            handleCloseModal();
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    const BypassController = (role) => {
        if (role === 'rt') {
            return 'rt';
        } else if (role === 'rw') {
            return 'rw';
        } else if (role === 'pd' || role === 'pp') {
            return 'pd';
        }
    }
    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd-MMMM-yyyy', { locale: idLocale });
    } 
    

    return (
        <>
            <Modal show={true} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Detail Surat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {jenisSurat === 'aspirasi' ? (
                        <>
                            <p>Isi Aspirasi: {surat.aspirasi}</p>
                            <p>Status : {surat.siApproved ? 'disetujui' : surat.isPending ? 'pending': 'ditolak'}</p>
                        </>
                    ) : (
                        <>
                            <p>Nama Acara: {surat.nameAcara}</p>
                            <p>Jenis Surat: {jenisSurat}</p>
                            <p>Tanggal Mulai: {formatDate(surat.tanggalMulai)}</p>
                            <p>Tanggal Selesai: {formatDate(surat.tanggalSelesai)}</p>
                            <p>Tempat Acara: {surat.tempatAcara}</p>
                            <p>Isi Acara:</p>
                            <ul>
                                {surat.isiAcara.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Tutup
                    </Button>
                    {jenisSurat === 'aspirasi' ? (
                        <>
                            <Button variant="success mx-2" onClick={() => {
                                handlePersetujuanAspirasi(true);
                            }}>
                                Setujui
                            </Button>
                            <Button variant="danger" onClick={() => {
                                handlePersetujuanAspirasi(false);
                            }}>
                                Tolak
                            </Button>
                    
                        </>
                    ) : (
                        <>
                            <div>
                                <Button variant="success mx-2" onClick={() => {
                                    handlePersetujuanSurat(true);
                                }}>
                                    Setujui
                                </Button>
                                <Button variant="danger" onClick={() => {
                                    handlePersetujuanSurat(false);
                                }}>
                                    Tolak
                                </Button>
                            </div>
                            {activeTab !== 'approved' && activeTab !== 'rejected' && <BypassSurat suratAcaraId={surat._id} role={BypassController(role)} />}
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    )
}


PopUpDetailSurat.propTypes = {
    surat: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nameAcara: PropTypes.string,
        jenisSurat: PropTypes.string,
        tanggalMulai: PropTypes.string,
        tanggalSelesai: PropTypes.string,
        tempatAcara: PropTypes.string,
        isiAcara: PropTypes.arrayOf(PropTypes.string),
        aspirasi: PropTypes.string
    }).isRequired,
    jenisSurat: PropTypes.string.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    idTokoh: PropTypes.string.isRequired,
    condition: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]).isRequired,
    role: PropTypes.string.isRequired,
    activeTab: PropTypes.string,
    refreshData: PropTypes.func.isRequired
};

export default PopUpDetailSurat;