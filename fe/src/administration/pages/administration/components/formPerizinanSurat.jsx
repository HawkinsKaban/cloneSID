import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const FormPerizinanSurat = ({ handleCloseModal }) => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const [warga, setWarga] = useState('');
    const [dataSurat, setDataSurat] = useState({
        nameAcara: '',
        jenisSurat: '',
        isiAcara: [''],
        tanggalMulai: '',
        tanggalSelesai: '',
        tempatAcara: '',
    });
    const [status, setStatus] = useState('idle'); 

    const { nameAcara, jenisSurat, isiAcara, tanggalMulai, tanggalSelesai, tempatAcara } = dataSurat;

    const token = localStorage.getItem('token');
    let idWarga;

    if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            idWarga = payload.id;
        }
    }

    useEffect(() => {
        setStatus('loading');
        axios.get(`${port}v1/warga/get/${idWarga}`)
            .then((res) => {
                setWarga(res.data.data._id);
                setStatus('success');
            })
            .catch((err) => {
                console.error(err);
                setStatus('error');
            });
    }, [idWarga]);

    const onChange = e => {
        if (e.target.name === 'isiAcara') {
            const updatedIsiAcara = [...isiAcara];
            updatedIsiAcara[e.target.dataset.index] = e.target.value;
            setDataSurat({ ...dataSurat, isiAcara: updatedIsiAcara });
        } else {
            setDataSurat({ ...dataSurat, [e.target.name]: e.target.value });
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await axios.post(`${port}v1/surat/create/suratAcara/TAversion/${warga}`, {
                nameAcara,
                jenisSurat,
                tanggalMulai,
                tanggalSelesai,
                tempatAcara,
                isiAcara
            });
            setStatus('success');
        } catch (err) {
            console.error(err.response.data);
            setStatus('error');
        }
    };

    const addIsiAcaraField = () => {
        setDataSurat({ ...dataSurat, isiAcara: [...isiAcara, ''] });
    };

    const jenisSuratOptions = [
        "surat keterangan domisili",
        "surat keterangan usaha",
        "surat kenal lahir",
        "surat pindah",
        "keterangan tidak mampu",
        "surat pengantar skck",
        "surat izin keramaian",
        "surat izin bepergian",
        "pembuatan kk baru",
        "pembuatan ktp baru",
        "pembuatan ktp lama",
        "pemecahan kk lama",
        "pbb-p2",
        "mutasi pbb",
        "pencatatan kependudukan",
        "surat kematian",
        "surat kelahiran",
        "santunan kematian",
        "pengajuan jkn-kis",
        "koordinator rtlh",
        "pendataan masalah sosial",
        "bantuan sosial"
    ];

    return (
        <div className="container">
            <h2 className="mt-4 mb-3">Buat Surat Acara</h2>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'error' && <p>Data tidak dapat dimuat.</p>}
            {status === 'success' && (
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nama Acara</label>
                        <input type="text" className="form-control" name="nameAcara" value={nameAcara} onChange={onChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Jenis Surat</label>
                        <select className="form-select" name="jenisSurat" value={jenisSurat} onChange={onChange} required>
                            <option value="" disabled>Pilih Jenis Surat</option>
                            {jenisSuratOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label">Tanggal Mulai</label>
                            <input type="date" className="form-control" name="tanggalMulai" value={tanggalMulai} onChange={onChange} required />
                        </div>
                        <div className="col">
                            <label className="form-label">Tanggal Selesai</label>
                            <input type="date" className="form-control" name="tanggalSelesai" value={tanggalSelesai} onChange={onChange} required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tempat Acara</label>
                        <input type="text" className="form-control" name="tempatAcara" value={tempatAcara} onChange={onChange} required />
                    </div>
                    {isiAcara.map((isi, index) => (
                        <div className="mb-3" key={index}>
                            <label className="form-label">Isi Acara {index + 1}</label>
                            <textarea
                                className="form-control"
                                name="isiAcara"
                                data-index={index}
                                value={isi}
                                onChange={onChange}
                                required
                            />
                        </div>
                    ))}
                    <button type="button" className="btn btn-primary me-2" onClick={addIsiAcaraField}>Tambah Isi Acara</button>
                    <button type="submit" className="btn btn-primary" onClick={handleCloseModal}>Submit</button>
                </form>
            )}
        </div>
    );
};

FormPerizinanSurat.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
};

export default FormPerizinanSurat;
