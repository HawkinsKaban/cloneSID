import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import ImageError from '../../../assets/ImageErrorHandling.svg';
import EditModal from './component/EditModal';

const KepalaDesaControl = () => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const port2 = import.meta.env.VITE_BASE_API_URL5;
    const [dataKepalaDesa, setDataKepalaDesa] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentKepalaDesa, setCurrentKepalaDesa] = useState({});
    const [editForm, setEditForm] = useState({ name: '', nik: '', nohp: '', alamat: '', newImages: null });
    const [selectedImage, setSelectedImage] = useState(null);
    const [status, setStatus] = useState('loading');

    const getDataKepalaDesa = async () => {
        setStatus('loading');
        try {
            const res = await axios.get(`${port}v1/pimpinanDesa/get`);
            setDataKepalaDesa(res.data.data);
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    useEffect(() => {
        getDataKepalaDesa();
    }, []);

    const handleImageError = (e) => {
        e.target.src = ImageError;
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${port}v1/pimpinanDesa/delete/${id}`);
            getDataKepalaDesa();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (kepalaDesa) => {
        setIsEditing(true);
        setCurrentKepalaDesa(kepalaDesa);
        setEditForm({
            name: kepalaDesa.user.name,
            nik: kepalaDesa.user.nik,
            nohp: kepalaDesa.user.nohp,
            alamat: kepalaDesa.user.alamat,
            newImages: null,
        });
    };

    const handleDeleteImage = async (image) => {
        const updatedImages = currentKepalaDesa.user.img.filter(img => img !== image);
        try {
            await axios.put(`${port}v1/user/update/${currentKepalaDesa._id}`, { ...currentKepalaDesa, img: updatedImages });
            setCurrentKepalaDesa({ ...currentKepalaDesa, img: updatedImages });
            getDataKepalaDesa();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editForm.name);
        formData.append('nik', editForm.nik);
        formData.append('nohp', editForm.nohp);
        formData.append('alamat', editForm.alamat);

        if (editForm.newImages && editForm.newImages.length > 0) {
            currentKepalaDesa.user.img.forEach(img => formData.append('img', img));
            for (let i = 0; i < editForm.newImages.length; i++) {
                formData.append('img', editForm.newImages[i]);
            }
        } else {
            currentKepalaDesa.user.img.forEach(img => formData.append('img', img));
        }

        try {
            await axios.put(`${port}v1/user/update/${currentKepalaDesa.user._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsEditing(false);
            setCurrentKepalaDesa({});
            setEditForm({ name: '', nik: '', nohp: '',  alamat: '', newImages: null });
            getDataKepalaDesa();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditFormChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const renderTable = (data) => {
        return (
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>NIK</th>
                            <th>Nomor HP</th>
                            <th>Alamat</th>
                            <th>Images</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.user._id}>
                                <td>{index + 1}</td>
                                <td>{item.user.name}</td>
                                <td>{item.user.nik}</td>
                                <td>{item.user.nohp}</td>
                                <td>{item.user.alamat}</td>
                                <td>
                                    <div className="d-inline">
                                        {item.user.img && item.user.img.length > 0 ? (
                                            item.user.img.map((image, imgIndex) => {
                                                const imageSrc = `${port2}${encodeURIComponent(image)}`;
                                                return (
                                                    <img
                                                        className='my-2'
                                                        key={imgIndex}
                                                        src={imageSrc}
                                                        alt={`img-${imgIndex}`}
                                                        width="50"
                                                        onError={handleImageError}
                                                        onClick={() => setSelectedImage(imageSrc)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <p>No images</p>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <button className="btn btn-primary mx-1" onClick={() => handleEdit(item)}>Edit</button>
                                    <button className="btn btn-danger mx-1" onClick={() => handleDelete(item.user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <Fragment>
            <h1 className='my-2 my-md-5'>Daftar Kepala Desa</h1>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'error' && <p>Data tidak berhasil dimuat.</p>}
            {status === 'success' && dataKepalaDesa.length > 0 && renderTable(dataKepalaDesa)}

            <EditModal
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editForm={editForm}
                handleEditFormChange={handleEditFormChange}
                handleSaveEdit={handleSaveEdit}
                currentKepalaDesa={currentKepalaDesa}
                handleDeleteImage={handleDeleteImage}
                setSelectedImage={setSelectedImage}
                handleNewImagesChange={(e) => setEditForm({ ...editForm, newImages: e.target.files })}
            />

            {selectedImage && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Image</h5>
                                <button type="button" className="close" onClick={() => setSelectedImage(null)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <img src={selectedImage} alt="Selected" className="img-fluid" onError={handleImageError} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedImage(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default KepalaDesaControl;
