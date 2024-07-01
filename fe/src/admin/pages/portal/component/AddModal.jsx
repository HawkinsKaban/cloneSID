import React, { useState } from 'react';

const AddModal = ({ isAdding, setIsAdding, addForm, handleAddFormChange, handleSaveAdd }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await handleSaveAdd(e);
            setIsAdding(false);
        } catch (err) {
            setError('Failed to save portal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`modal fade show ${isAdding ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Portal</h5>
                        <button type="button" className="close" onClick={() => setIsAdding(false)}>
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
                                    value={addForm.title}
                                    onChange={handleAddFormChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Link</label>
                                <textarea
                                    name="content"
                                    value={addForm.content}
                                    onChange={handleAddFormChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Isi</label>
                                <textarea
                                    name="isi"
                                    value={addForm.isi}
                                    onChange={handleAddFormChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Images</label>
                                <input
                                    type="file"
                                    name="img"
                                    multiple
                                    onChange={handleAddFormChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-success" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)} disabled={loading}>
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

export default AddModal;
