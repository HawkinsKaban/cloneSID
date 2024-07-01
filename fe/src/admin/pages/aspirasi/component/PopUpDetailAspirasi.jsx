import React, { useState } from 'react';
import axios from 'axios';

const PopUpDetailAspirasi = ({ surat, handleCloseModal, refreshData }) => {
    const port = import.meta.env.VITE_BASE_API_URL3;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePersetujuanAspirasi = async (statusPersetujuan) => {
        try {
            setLoading(true);
            setError(null);
            const update = {
                siApproved: statusPersetujuan,
                isPending: false
            };

            const request = await axios.put(`${port}v1/aspirasi/updateAspirasi/${surat._id}`, update);
            refreshData();
            handleCloseModal();
        } catch (err) {
            console.error("Error: ", err);
            setError('Failed to update aspirasi');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Detail Aspirasi</h5>
                        <button type="button" className="close" onClick={handleCloseModal}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                        <p><strong>Aspirasi:</strong> {surat.aspirasi}</p>
                        <p><strong>Tanggal:</strong> {new Date(surat.createdAt).toLocaleDateString()}</p>
                        <p><strong>Status Pengajuan:</strong> {surat.isPending ? 'Pending' : 'Selesai'}</p>
                        <p><strong>Untuk:</strong> {surat.isPublish ? 'Untuk Umum' : 'Untuk Kades'}</p>
                        <p><strong>Status:</strong> {surat.siApproved ? 'Disetujui' : surat.isPending ? 'Pending' : 'Ditolak'}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                        <button type="button" className="btn btn-danger" onClick={() => handlePersetujuanAspirasi(false)} disabled={loading}>
                            {loading ? 'Loading...' : 'Tolak'}
                        </button>
                        <button type="button" className="btn btn-success" onClick={() => handlePersetujuanAspirasi(true)} disabled={loading}>
                            {loading ? 'Loading...' : 'Setujui'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopUpDetailAspirasi;
