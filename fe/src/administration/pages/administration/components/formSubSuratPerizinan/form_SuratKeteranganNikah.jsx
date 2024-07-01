import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const FormSuratKeteranganNikah = ({ handleCloseModal }) => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const [warga, setWarga] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dataSurat, setDataSurat] = useState({
        nameAcara: '',
        jenisSurat: 'keterangan nikah',
        isiAcara: [''],
        tanggalMulai: '',
        tanggalSelesai: '',
        tempatAcara: '',
        dataSubSurat: {
            statusPernikahan: '',
            istriKe: 1,
            namaAyah: '',
            nikAyah: '',
            tempatlahirAyah: '',
            tanggallahirAyah: '',
            kewargaNegaraanAyah: '',
            agamaAyah: '',
            pekerjaanAyah: '',
            alamatAyah: '',
            namaIbu: '',
            nikIbu: '',
            tempatlahirIbu: '',
            tanggallahirIbu: '',
            kewargaNegaraanIbu: '',
            agamaIbu: '',
            pekerjaanIbu: '',
            alamatIbu: ''
        }
    });

    const { nameAcara, isiAcara, tanggalMulai, tanggalSelesai, tempatAcara, dataSubSurat } = dataSurat;

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
            <h2 className="mt-4 mb-3">Buat Surat Keterangan Nikah</h2>
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

                <div className="mb-3">
                    <label className="form-label">Status Pernikahan</label>
                    <select className="form-control" name="dataSubSurat.statusPernikahan" value={dataSubSurat.statusPernikahan} onChange={onChange} required>
                        <option value="">Pilih Status Pernikahan</option>
                        <option value="laki-laki perjaka">Laki-laki Perjaka</option>
                        <option value="laki-laki duda">Laki-laki Duda</option>
                        <option value="perempuan perawan">Perempuan Perawan</option>
                        <option value="perempuan janda">Perempuan Janda</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Istri Ke</label>
                    <select className="form-control" name="dataSubSurat.istriKe" value={dataSubSurat.istriKe} onChange={onChange} required>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Nama Ayah</label>
                    <input type="text" className="form-control" name="dataSubSurat.namaAyah" value={dataSubSurat.namaAyah} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">NIK Ayah</label>
                    <input type="text" className="form-control" name="dataSubSurat.nikAyah" value={dataSubSurat.nikAyah} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tempat Lahir Ayah</label>
                    <input type="text" className="form-control" name="dataSubSurat.tempatlahirAyah" value={dataSubSurat.tempatlahirAyah} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tanggal Lahir Ayah</label>
                    <input type="text" className="form-control" name="dataSubSurat.tanggallahirAyah" value={dataSubSurat.tanggallahirAyah} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Kewarganegaraan Ayah</label>
                    <input type="text" className="form-control" name="dataSubSurat.kewargaNegaraanAyah" value={dataSubSurat.kewargaNegaraanAyah} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Agama Ayah</label>
                    <input type="text" className="form-control" name="dataSubSurat.agamaAyah" value={dataSubSurat.agamaAyah} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Pekerjaan Ayah</label>
                    <input type="text" className="form-control" name="dataSubSurat.pekerjaanAyah" value={dataSubSurat.pekerjaanAyah} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Alamat Ayah</label>
                    <input type="text" className="form-control" name="dataSubSurat.alamatAyah" value={dataSubSurat.alamatAyah} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nama Ibu</label>
                    <input type="text" className="form-control" name="dataSubSurat.namaIbu" value={dataSubSurat.namaIbu} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">NIK Ibu</label>
                    <input type="text" className="form-control" name="dataSubSurat.nikIbu" value={dataSubSurat.nikIbu} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tempat Lahir Ibu</label>
                    <input type="text" className="form-control" name="dataSubSurat.tempatlahirIbu" value={dataSubSurat.tempatlahirIbu} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tanggal Lahir Ibu</label>
                    <input type="text" className="form-control" name="dataSubSurat.tanggallahirIbu" value={dataSubSurat.tanggallahirIbu} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Kewarganegaraan Ibu</label>
                    <input type="text" className="form-control" name="dataSubSurat.kewargaNegaraanIbu" value={dataSubSurat.kewargaNegaraanIbu} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Agama Ibu</label>
                    <input type="text" className="form-control" name="dataSubSurat.agamaIbu" value={dataSubSurat.agamaIbu} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Pekerjaan Ibu</label>
                    <input type="text" className="form-control" name="dataSubSurat.pekerjaanIbu" value={dataSubSurat.pekerjaanIbu} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Alamat Ibu</label>
                    <input type="text" className="form-control" name="dataSubSurat.alamatIbu" value={dataSubSurat.alamatIbu} onChange={onChange} required />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

FormSuratKeteranganNikah.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
};

export default FormSuratKeteranganNikah;
