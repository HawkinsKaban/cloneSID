import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const FormSuratKuasaAktaKematian = ({ handleCloseModal }) => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const [warga, setWarga] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dataSurat, setDataSurat] = useState({
        nameAcara: '',
        jenisSurat: 'surat kematian',
        isiAcara: [''],
        tanggalMulai: '',
        tanggalSelesai: '',
        dataSubSurat: {
            namaPenerimaKuasa: '',
            nikPenerimaKuasa: '',
            tempatLahirPenerimaKuasa: '',
            tanggalLahirPenerimaKuasa: '',
            jenisKelaminPenerimaKuasa: '',
            agamaPenerimaKuasa: '',
            pekerjaanPenerimaKuasa: '',
            alamatPenerimaKuasa: '',
            namaAlmarhum: '',
            nikAlmarhum: ''
        }
    });

    const { nameAcara, isiAcara, tanggalMulai, tanggalSelesai, dataSubSurat } = dataSurat;

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
        const fetchData = async () => {
            try {
                const res = await axios.get(`${port}v1/warga/get/${idWarga}`);
                setWarga(res.data.data._id);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch warga data');
            }
        };
        fetchData();
    }, [idWarga]);

    const onChange = e => {
        const { name, value, dataset } = e.target;
        if (name === 'isiAcara') {
            const updatedIsiAcara = [...isiAcara];
            updatedIsiAcara[dataset.index] = value;
            setDataSurat({ ...dataSurat, isiAcara: updatedIsiAcara });
        } else if (name.startsWith('dataSubSurat.')) {
            const subName = name.split('.')[1];
            setDataSurat({ ...dataSurat, dataSubSurat: { ...dataSubSurat, [subName]: value } });
        } else {
            setDataSurat({ ...dataSurat, [name]: value });
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${port}v1/surat/create/suratAcara/TAversion/${warga}`, dataSurat);
            handleCloseModal(); 
        } catch (err) {
            console.error(err.response.data);
            setError('Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    const addIsiAcaraField = () => {
        setDataSurat({ ...dataSurat, isiAcara: [...isiAcara, ''] });
    };

    return (
        <div className="container">
            <h2 className="mt-4 mb-3">Buat Surat Kuasa Akta Kematian</h2>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nama Acara</label>
                    <input type="text" className="form-control" name="nameAcara" value={nameAcara} onChange={onChange} required />
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
                
                <div className="mb-3">
                    <label className="form-label">Nama Penerima Kuasa</label>
                    <input type="text" className="form-control" name="dataSubSurat.namaPenerimaKuasa" value={dataSubSurat.namaPenerimaKuasa} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">NIK Penerima Kuasa</label>
                    <input type="text" className="form-control" name="dataSubSurat.nikPenerimaKuasa" value={dataSubSurat.nikPenerimaKuasa} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tempat Lahir Penerima Kuasa</label>
                    <input type="text" className="form-control" name="dataSubSurat.tempatLahirPenerimaKuasa" value={dataSubSurat.tempatLahirPenerimaKuasa} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tanggal Lahir Penerima Kuasa</label>
                    <input type="date" className="form-control" name="dataSubSurat.tanggalLahirPenerimaKuasa" value={dataSubSurat.tanggalLahirPenerimaKuasa.split('T')[0]} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Jenis Kelamin Penerima Kuasa</label>
                    <select className="form-control" name="dataSubSurat.jenisKelaminPenerimaKuasa" value={dataSubSurat.jenisKelaminPenerimaKuasa} onChange={onChange} required>
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="laki-laki">Laki-laki</option>
                        <option value="perempuan">Perempuan</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Agama Penerima Kuasa</label>
                    <input type="text" className="form-control" name="dataSubSurat.agamaPenerimaKuasa" value={dataSubSurat.agamaPenerimaKuasa} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Pekerjaan Penerima Kuasa</label>
                    <input type="text" className="form-control" name="dataSubSurat.pekerjaanPenerimaKuasa" value={dataSubSurat.pekerjaanPenerimaKuasa} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Alamat Penerima Kuasa</label>
                    <input type="text" className="form-control" name="dataSubSurat.alamatPenerimaKuasa" value={dataSubSurat.alamatPenerimaKuasa} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nama Almarhum</label>
                    <input type="text" className="form-control" name="dataSubSurat.namaAlmarhum" value={dataSubSurat.namaAlmarhum} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">NIK Almarhum</label>
                    <input type="text" className="form-control" name="dataSubSurat.nikAlmarhum" value={dataSubSurat.nikAlmarhum} onChange={onChange} required />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

FormSuratKuasaAktaKematian.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
};

export default FormSuratKuasaAktaKematian;
