import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import propTypes from 'prop-types';
import axios from 'axios';

const ModalLengkapiDataUser = ({ show, handleClose, userId }) => {
    const [formData, setFormData] = useState({
        tempatlahir: '',
        tanggallahir: '',
        jenisKelamin: '',
        agama: '',
        pekerjaan: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Uppercase conversion
            const dataToSend = {
                ...formData,
                jenisKelamin: formData.jenisKelamin.toUpperCase(),
                agama: formData.agama.toUpperCase(),
                pekerjaan: formData.pekerjaan.toUpperCase(),
                tempatlahir: formData.tempatlahir.toUpperCase()
            };

            const response = await axios.put(`http://localhost:3555/api/v1/user/update/${userId}`, dataToSend);
            console.log(response.data);
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Lengkapi Data User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTempatLahir">
                        <Form.Label>Tempat Lahir</Form.Label>
                        <Form.Control
                            type="text"
                            name="tempatlahir"
                            value={formData.tempatlahir}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTanggalLahir">
                        <Form.Label>Tanggal Lahir</Form.Label>
                        <Form.Control
                            type="date"
                            name="tanggallahir"
                            value={formData.tanggallahir}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formJenisKelamin">
                        <Form.Label>Jenis Kelamin</Form.Label>
                        <Form.Control
                            as="select"
                            name="jenisKelamin"
                            value={formData.jenisKelamin}
                            onChange={handleChange}
                        >
                            <option value="">Pilih</option>
                            <option value="LAKI-LAKI">Laki-Laki</option>
                            <option value="PEREMPUAN">Perempuan</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formAgama">
                        <Form.Label>Agama</Form.Label>
                        <Form.Control
                            type="text"
                            name="agama"
                            value={formData.agama}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPekerjaan">
                        <Form.Label>Pekerjaan</Form.Label>
                        <Form.Control
                            type="text"
                            name="pekerjaan"
                            value={formData.pekerjaan}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Simpan
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

ModalLengkapiDataUser.propTypes = {
    show: propTypes.bool.isRequired,
    handleClose: propTypes.func.isRequired,
    userId: propTypes.string.isRequired
};

export default ModalLengkapiDataUser;
