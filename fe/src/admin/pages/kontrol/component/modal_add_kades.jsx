import { useState } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import propTypes from 'prop-types';
import axios from 'axios';

const ModalTambahKades = ({ show, handleClose }) => {
    const [searchName, setSearchName] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roleInput, setRoleInput] = useState(1); // Default role is Kepala Desa

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://localhost:3555/api/v1/user/get/name-user', { name: searchName });
            setSearchResult(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRoleChange = (e) => {
        setRoleInput(e.target.value);
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            alert("Please select a user first.");
            return;
        }
        try {
            const response = await axios.post(`http://localhost:3555/api/v1/admin/post-pimpinan-desa/${selectedUser._id}`, { RolePemimpinDesa: roleInput });
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tambah Kepala Desa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formSearchName">
                        <Form.Label>Cari User</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Masukkan Nama User"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <Button variant="secondary" onClick={handleSearch}>
                            Cari
                        </Button>
                    </Form.Group>
                    {searchResult && (
                        <ListGroup>
                            <ListGroup.Item action onClick={() => handleSelectUser(searchResult)}>
                                {searchResult.name} - {searchResult._id}
                            </ListGroup.Item>
                        </ListGroup>
                    )}
                    {selectedUser && (
                        <div>
                            <h5>Selected User:</h5>
                            <p>{selectedUser.name}</p>
                            <p>{selectedUser._id}</p>
                        </div>
                    )}
                    <Form.Group controlId="formRoleInput">
                        <Form.Label>Role Pemimpin Desa</Form.Label>
                        <Form.Control as="select" value={roleInput} onChange={handleRoleChange}>
                            <option value={1}>Kepala Desa</option>
                            <option value={2}>Wakil Kepala Desa</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Simpan
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

ModalTambahKades.propTypes = {
    show: propTypes.bool.isRequired,
    handleClose: propTypes.func.isRequired
};

export default ModalTambahKades;
