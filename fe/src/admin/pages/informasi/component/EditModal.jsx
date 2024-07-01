import React, { useState } from 'react';
import ImageError from '../../../../assets/ImageErrorHandling.svg';

const EditModal = ({ isEditing, setIsEditing, editForm, handleEditFormChange, handleSaveEdit, currentInformasi, handleDeleteImage, setSelectedImage }) => {
    const port = import.meta.env.VITE_BASE_API_URL4;
    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageError = (e) => {
        e.target.src = ImageError;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await handleSaveEdit(e, newImages); 
            setIsEditing(false);
        } catch (err) {
            setError('Failed to save information');
        } finally {
            setLoading(false);
        }
    };

    const handleNewImagesChange = (e) => {
        setNewImages([...e.target.files]);
    };

    return (
        <div className={`modal fade show ${isEditing ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Informasi</h5>
                        <button type="button" className="close" onClick={() => setIsEditing(false)}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editForm.title}
                                    onChange={handleEditFormChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    name="content"
                                    value={editForm.content}
                                    onChange={handleEditFormChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Images</label>
                                <div>
                                    {currentInformasi.img && currentInformasi.img.map((image, imgIndex) => {
                                        const imageSrc = `${port}${encodeURIComponent(image)}`;
                                        return (
                                            <div key={imgIndex} className="d-inline-block position-relative mx-1">
                                                <img
                                                    className='my-2'
                                                    src={imageSrc}
                                                    alt={`img-${imgIndex}`}
                                                    width="50"
                                                    onError={handleImageError}
                                                    onClick={() => setSelectedImage(imageSrc)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle"
                                                    onClick={() => handleDeleteImage(image)}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Add New Images</label>
                                <input
                                    type="file"
                                    name="newImages"
                                    onChange={handleNewImagesChange}
                                    className="form-control"
                                    multiple
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-success" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={loading}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditModal;
