import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import ImageError from '../../../assets/ImageErrorHandling.svg';
import EditModal from './component/EditModal';
import AddModal from './component/AddModal';


const PortalControl = () => {
    const port = import.meta.env.VITE_BASE_API_URL;
    const port2 = import.meta.env.VITE_BASE_API_URL4;
    const [dataPortal, setDataPortal] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [currentPortal, setCurrentPortal] = useState({});
    const [editForm, setEditForm] = useState({ title: '', content: '', isi: '', newImages: null });
    const [addForm, setAddForm] = useState({ title: '', content: '', isi: '', img: null });
    const [selectedImage, setSelectedImage] = useState(null);
    const [status, setStatus] = useState('loading'); 

    const getDataPortal = async () => {
        setStatus('loading');
        try {
            const res = await axios.get(`${port}v1/portal/get-portal`);
            setDataPortal(res.data.data.data);
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    useEffect(() => {
        getDataPortal();
    }, []);

    const handleImageError = (e) => {
        e.target.src = ImageError;
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${port}v1/portal/delete-portal/${id}`);
            getDataPortal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (portal) => {
        setIsEditing(true);
        setCurrentPortal(portal);
        setEditForm({
            title: portal.title,
            content: portal.content,
            isi: portal.isi,
            newImages: null,
        });
    };

    const handleDeleteImage = async (image) => {
        const updatedImages = currentPortal.img.filter(img => img !== image);
        try {
            await axios.put(`${port}v1/portal/update-portal/${currentPortal._id}`, { ...currentPortal, img: updatedImages });
            setCurrentPortal({ ...currentPortal, img: updatedImages });
            getDataPortal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', editForm.title);
        formData.append('content', editForm.content);
        formData.append('isi', editForm.isi);

        if (editForm.newImages && editForm.newImages.length > 0) {
            currentPortal.img.forEach(img => formData.append('img', img));
            for (let i = 0; i < editForm.newImages.length; i++) {
                formData.append('img', editForm.newImages[i]);
            }
        } else {
            currentPortal.img.forEach(img => formData.append('img', img));
        }

        try {
            await axios.put(`${port}v1/portal/update-portal/${currentPortal._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsEditing(false);
            setCurrentPortal({});
            setEditForm({ title: '', content: '', isi: '', newImages: null });
            getDataPortal();
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
        formData.append('isi', addForm.isi);
        for (let i = 0; i < addForm.img.length; i++) {
            formData.append('img', addForm.img[i]);
        }

        try {
            await axios.post(`${port}v1/portal/post-portal`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsAdding(false);
            setAddForm({ title: '', content: '', isi: '', img: null });
            getDataPortal();
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
                            <th>Link</th>
                            <th>Isi</th>
                            <th>Images</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.title}</td>
                                <td style={{ maxWidth: '300px', overflowWrap: 'break-word' }}>{item.content}</td>
                                <td style={{ maxWidth: '300px', overflowWrap: 'break-word' }}>{item.isi}</td>
                                <td>
                                    <div className="d-inline">
                                        {item.img && item.img.length > 0 ? (
                                            item.img.map((image, imgIndex) => {
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
                                    <button className="btn btn-danger mx-1" onClick={() => handleDelete(item._id)}>Delete</button>
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
            <h1 className='my-2 my-md-5'>Daftar Portal</h1>
            <button className="btn btn-success mb-3" onClick={() => setIsAdding(true)}>Add Portal</button>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'error' && <p>Data tidak berhasil dimuat.</p>}
            {status === 'success' && dataPortal.length > 0 && renderTable(dataPortal)}

            <EditModal
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editForm={editForm}
                handleEditFormChange={handleEditFormChange}
                handleSaveEdit={handleSaveEdit}
                currentPortal={currentPortal}
                handleDeleteImage={handleDeleteImage}
                setSelectedImage={setSelectedImage}
                handleNewImagesChange={(e) => setEditForm({ ...editForm, newImages: e.target.files })}
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

export default PortalControl;
