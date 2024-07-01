import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import propTypes from 'prop-types';
import axios from 'axios';

const ModalTambahUser = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        nik: '',
        alamat: '',
        nohp: '',
        statusPerkawinan: '',
        domisili: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDomisiliChange = (index, value) => {
        const newDomisili = [...formData.domisili];
        newDomisili[index] = value;
        setFormData({
            ...formData,
            domisili: newDomisili
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3555/api/v1/user/post-user', formData);
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tambah Data User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Nama</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formNik">
                        <Form.Label>NIK</Form.Label>
                        <Form.Control type="text" name="nik" value={formData.nik} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formAlamat">
                        <Form.Label>Alamat</Form.Label>
                        <Form.Control type="text" name="alamat" value={formData.alamat} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formNohp">
                        <Form.Label>No HP</Form.Label>
                        <Form.Control type="text" name="nohp" value={formData.nohp} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formStatusPerkawinan">
                        <Form.Label>Status Perkawinan</Form.Label>
                        <Form.Control type="text" name="statusPerkawinan" value={formData.statusPerkawinan} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formDomisili">
                        <Form.Label>RT</Form.Label>
                        <Form.Control as="select" value={formData.domisili[0] || ''} onChange={(e) => handleDomisiliChange(0, e.target.value)}>
                            <option value="">Pilih RT</option>
                            {[...Array(14).keys()].map(i => (
                                <option key={i} value={i + 1}>{i + 1}</option>
                            ))}
                        </Form.Control>
                        <Form.Label>RW</Form.Label>
                        <Form.Control as="select" value={formData.domisili[1] || ''} onChange={(e) => handleDomisiliChange(1, e.target.value)}>
                            <option value="">Pilih RW</option>
                            {[...Array(10).keys()].map(i => (
                                <option key={i} value={i + 1}>{i + 1}</option>
                            ))}
                        </Form.Control>
                        <Form.Control type="text" placeholder="Desa" value={formData.domisili[2] || ''} onChange={(e) => handleDomisiliChange(2, e.target.value)} />
                        <Form.Control type="text" placeholder="Kecamatan" value={formData.domisili[3] || ''} onChange={(e) => handleDomisiliChange(3, e.target.value)} />
                        <Form.Control type="text" placeholder="Kabupaten" value={formData.domisili[4] || ''} onChange={(e) => handleDomisiliChange(4, e.target.value)} />
                        <Form.Control type="text" placeholder="Provinsi" value={formData.domisili[5] || ''} onChange={(e) => handleDomisiliChange(5, e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Simpan
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

ModalTambahUser.propTypes = {
    show: propTypes.bool.isRequired,
    handleClose: propTypes.func.isRequired
};

export default ModalTambahUser;
