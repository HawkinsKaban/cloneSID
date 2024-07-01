import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useState, useEffect } from 'react';

const DetailSuratWarga = ({ surat, handleCloseModal }) => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const [editAble, setEditAble] = useState(false);
    const [isiAcara, setIsiAcara] = useState(surat.isiAcara || []);
    const [detailSurat, setDetailSurat] = useState(null);
    const [status, setStatus] = useState('loading'); 

    const connditionEditAble = () => {
        if (
            surat.statusPersetujuan === "ditolak rt" ||
            surat.statusPersetujuan === "ditolak rw" ||
            surat.statusPersetujuan === "ditolak perangkat desa"
        ) {
            setEditAble(true);
        }
    };

    useEffect(() => {
        fetchDetailSurat();
        connditionEditAble();
    }, [surat.jenisSurat, surat.subSuratId]);

    const handleIsiAcaraChange = (index, event) => {
        const newIsiAcara = [...isiAcara];
        newIsiAcara[index] = event.target.value;
        setIsiAcara(newIsiAcara);
    };

    const handleAddIsiAcara = () => {
        setIsiAcara([...isiAcara, ""]);
    };

    const handleRemoveIsiAcara = (index) => {
        const newIsiAcara = isiAcara.filter((_, i) => i !== index);
        setIsiAcara(newIsiAcara);
    };

    const fetchDetailSurat = async () => {
        try {
            const jenis_surat = surat.jenisSurat.replace(/\s/g, '_');
            const subSuratId = surat.subSuratId;
            const request = await axios.get(`${port}v1/surat/get/detail-surat/${subSuratId}/${jenis_surat}`);
            setDetailSurat(request.data.data);
            setStatus('success');
        } catch (err) {
            console.error("Error fetching detail surat: ", err);
            setStatus('error');
        }
    };

    // const handleSave = async () => {
    //     try {
    //         const response = await axios.put(`${port}v1/surat/revisi-surat-warga/${surat._id}`, {
    //             "newIsiAcara": isiAcara
    //         });
    //         handleCloseModal();
    //     } catch (error) {
    //         console.error("Error editing surat acara:", error);
    //     }
    // };

    return (
        <>
            <div className="modal container-fluid" style={{ display: "block" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Detail Surat</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="modal-body">
                            <p>Nomor Surat: {surat.nomorSurat ? surat.nomorSurat : "Belum ada nomor surat"}</p>
                            <p>Nama Acara: {surat.nameAcara}</p>
                            <p>Jenis Surat: {surat.jenisSurat}</p>
                            <p>Status: {surat.statusAcara}</p>
                            <p>Status Persetujuan: {surat.statusPersetujuan}</p>
                            <div>Isi Acara:
                                <ul>
                                    {isiAcara.map((isi, index) => (
                                        <li key={index}>{isi}</li>
                                    ))}
                                </ul>
                            </div>
                            <p>Detail Surat:</p>
                            {status === 'loading' && <p>Loading...</p>}
                            {status === 'error' && <p>Data tidak dapat dimuat.</p>}
                            {status === 'success' && detailSurat && (
                                <ul>
                                    {Object.entries(detailSurat)
                                        .filter(([key]) => key !== '_id' && key !== '__v')
                                        .map(([key, value], index) => (
                                            <li key={index}>
                                                {key}: {Array.isArray(value) ? value.join(', ') : value.toString()}
                                            </li>
                                        ))}
                                </ul>
                            )}
                            {editAble && (
                                <div>
                                    {isiAcara.map((isi, index) => (
                                        <div className="form-group" key={index}>
                                            <label>Isi Acara {index + 1}</label>
                                            <textarea
                                                name="isiAcara"
                                                data-index={index}
                                                value={isi}
                                                onChange={(e) => handleIsiAcaraChange(index, e)}
                                                required
                                            />
                                            <Button variant="danger" onClick={() => handleRemoveIsiAcara(index)}>
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant="primary" onClick={handleAddIsiAcara}>
                                        Add Isi Acara
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Tutup
                            </Button>
                            {/* {editAble && (
                                <Button variant="primary" onClick={handleSave}>
                                    Save
                                </Button>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

DetailSuratWarga.propTypes = {
    surat: PropTypes.object.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
};

export default DetailSuratWarga;
