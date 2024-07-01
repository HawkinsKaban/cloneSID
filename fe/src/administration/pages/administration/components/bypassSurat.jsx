import axios from 'axios';
import { useState } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

const BypassSurat = ({ suratAcaraId, role }) => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleBypassSurat = async () => {
        setIsLoading(true);
        setError('');
        try {
            const request = await axios.put(`${port}v1/surat/baypass-${role}/${suratAcaraId}`);
            setIsButtonDisabled(true);
            setIsLoading(false);
        } catch (err) {
            console.error("Error: ", err);
            setError('Error bypassing surat.');
            setIsLoading(false);
        }
    };

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="warning" onClick={handleBypassSurat} disabled={isButtonDisabled || isLoading}>
                {/* {isLoading ? <Spinner animation="border" size="sm" /> : 'Bypass Surat'} */}
            </Button>
        </>
    );
};

BypassSurat.propTypes = {
    suratAcaraId: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
};

export default BypassSurat;
