import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import ImageError from '../../../assets/ImageErrorHandling.svg';
import EditModal from './component/EditModal';
import AddModal from './component/AddModal';

const KegiatanControl = () => {
    const port = import.meta.env.VITE_BASE_API_URL;
    const port2 = import.meta.env.VITE_BASE_API_URL4;
    const [dataKegiatan, setDataKegiatan] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [currentKegiatan, setCurrentKegiatan] = useState({});
    const [editForm, setEditForm] = useState({ title: '', content: '', date: '', location: '' });
    const [addForm, setAddForm] = useState({ title: '', content: '', date: '', location: '', img: null });
    const [selectedImage, setSelectedImage] = useState(null);
    const [status, setStatus] = useState('loading');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const getDataKegiatan = async (page, limit) => {
        setStatus('loading');
        try {
            const res = await axios.get(`${port}v1/kegiatan/get-kegiatan?page=${page}&limit=${limit}`);
            setDataKegiatan(res.data.data.data);
            setTotalPages(res.data.data.totalPages);
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    useEffect(() => {
        getDataKegiatan(page, limit);
    }, [page, limit]);

    const handleImageError = (e) => {
        e.target.src = ImageError;
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${port}v1/kegiatan/delete-kegiatan/${id}`);
            getDataKegiatan(page, limit);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (kegiatan) => {
        setIsEditing(true);
        setCurrentKegiatan(kegiatan);
        setEditForm({
            title: kegiatan.title,
            content: kegiatan.content,
            date: new Date(kegiatan.date).toISOString().slice(0, 16),
            location: kegiatan.location,
        });
    };

    const handleDeleteImage = async (image) => {
        const updatedImages = currentKegiatan.img.filter(img => img !== image);
        try {
            await axios.put(`${port}v1/kegiatan/update-kegiatan/${currentKegiatan._id}`, { ...currentKegiatan, img: updatedImages });
            setCurrentKegiatan({ ...currentKegiatan, img: updatedImages });
            getDataKegiatan(page, limit);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveEdit = async (e, newImages) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', editForm.title);
        formData.append('content', editForm.content);
        formData.append('date', editForm.date);
        formData.append('location', editForm.location);

        if (newImages.length > 0) {
            const oldImages = currentKegiatan.img || [];
            oldImages.forEach(img => formData.append('img', img));
            newImages.forEach(img => formData.append('img', img));
        } else {
            const oldImages = currentKegiatan.img || [];
            oldImages.forEach(img => formData.append('img', img));
        }

        try {
            await axios.put(`${port}v1/kegiatan/update-kegiatan/${currentKegiatan._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsEditing(false);
            setCurrentKegiatan({});
            setEditForm({ title: '', content: '', date: '', location: '' });
            getDataKegiatan(page, limit);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditFormChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleAddFormChange = (e) => {
        if (e.target.name === 'img') {
            setAddForm({ ...addForm, [e.target.name]: e.target.files });
        } else {
            setAddForm({ ...addForm, [e.target.name]: e.target.value });
        }
    };

    const handleSaveAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', addForm.title);
        formData.append('content', addForm.content);
        formData.append('date', addForm.date);
        formData.append('location', addForm.location);
        for (let i = 0; i < addForm.img.length; i++) {
            formData.append('img', addForm.img[i]);
        }

        try {
            await axios.post(`${port}v1/kegiatan/post-kegiatan`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsAdding(false);
            setAddForm({ title: '', content: '', date: '', location: '', img: null });
            getDataKegiatan(page, limit);
        } catch (err) {
            console.error(err);
        }
    };

    const renderTable = (data) => {
        return (
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Images</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item._id}>
                                <td>{(page - 1) * limit + index + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.content}</td>
                                <td>
                                    <div className="d-inline">
                                        {item.img.map((image, imgIndex) => {
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
                                        })}
                                    </div>
                                </td>
                                <td>{new Date(item.date).toLocaleDateString()}</td>
                                <td>{item.location}</td>
                                <td>
                                    <button className="btn btn-primary mx-1" onClick={() => handleEdit(item)}>Edit</button>
                                    <button className="btn btn-danger mx-1" onClick={() => handleDelete(item._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-secondary" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                    <span>Page {page} of {totalPages}</span>
                    <button className="btn btn-secondary" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
                </div>
            </div>
        );
    };

    return (
        <Fragment>
            <h1 className='my-2 my-md-5'>Daftar Kegiatan</h1>
            <button className="btn btn-success mb-3" onClick={() => setIsAdding(true)}>Add Kegiatan</button>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'error' && <p>Data tidak berhasil dimuat.</p>}
            {status === 'success' && dataKegiatan.length > 0 && renderTable(dataKegiatan)}
            {status === 'success' && dataKegiatan.length === 0 && <p>Belum ada data yang ditambahkan.</p>}

            <EditModal
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editForm={editForm}
                handleEditFormChange={handleEditFormChange}
                handleSaveEdit={handleSaveEdit}
                currentKegiatan={currentKegiatan}
                handleDeleteImage={handleDeleteImage}
                setSelectedImage={setSelectedImage}
            />

            <AddModal
                isAdding={isAdding}
                setIsAdding={setIsAdding}
                addForm={addForm}
                handleAddFormChange={handleAddFormChange}
                handleSaveAdd={handleSaveAdd}
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
}

export default KegiatanControl;
