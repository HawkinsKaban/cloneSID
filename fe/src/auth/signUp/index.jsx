import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../../shared/layout/navBar';
import Footer from '../../shared/layout/footer';
import axios from 'axios';
import './index.css';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nohp: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const { username, password, nohp } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_API_URL2}v1/warga/register`, {
                username: username.toUpperCase(),
                password,
                nohp
            });

            if (res.status === 200) {
                setSuccessMessage('Registration successful. Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setErrorMessage(res.data.message || 'An error occurred. Please try again.');
            }
        } catch (err) {
            setErrorMessage(err.response ? err.response.data.message : 'An error occurred. Please try again.');
        }
    };

    return (
        <Fragment>
            <div className="container-fluid sign-up-container p-0">
                <div className="container-fluid sign-up-container-background p-0">
                    <NavBar type={1} />
                    <div className="row mt-5">
                        <div className="col-1 col-md-2"></div>
                        <div className="col-10 col-md-8 mb-5">
                            <div className="card card-form-sign-up text-light pt-4 ">
                                <p className='text-center' style={{ fontSize: '45px', fontWeight: 'bold' }}>SIGN UP</p>
                                {errorMessage && (
                                    <div className="alert alert-danger text-center" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="alert alert-success text-center" role="alert">
                                        {successMessage}
                                    </div>
                                )}
                                <form onSubmit={onSubmit}>
                                    <div className="row">
                                        <div className="col-1"></div>
                                        <div className="col-10">
                                            <div className="nama mb-2">
                                                <p style={{ fontSize: '24px' }} className='mb-0'>Nama</p>
                                                <input
                                                    className='py-3 ps-3'
                                                    style={{ width: '100%', borderRadius: '0.5vw' }}
                                                    type="text"
                                                    placeholder="Masukkan Nama"
                                                    name="username"
                                                    value={username}
                                                    onChange={onChange}
                                                />
                                            </div>
                                            <div className="Password mb-2">
                                                <p style={{ fontSize: '24px' }} className='mb-0'>Password</p>
                                                <input
                                                    className='py-3 ps-3'
                                                    style={{ width: '100%', borderRadius: '0.5vw' }}
                                                    type="password"
                                                    placeholder="Masukkan Password"
                                                    name="password"
                                                    value={password}
                                                    onChange={onChange}
                                                />
                                            </div>
                                            <div className="Nomor mb-2">
                                                <p style={{ fontSize: '24px' }} className='mb-0'>Nomor HP</p>
                                                <input
                                                    className='py-3 ps-3'
                                                    style={{ width: '100%', borderRadius: '0.5vw' }}
                                                    type="text"
                                                    placeholder='Masukkan Nomor HP Anda'
                                                    name="nohp"
                                                    value={nohp}
                                                    onChange={onChange}
                                                />
                                            </div>
                                            <div className="btn-warp d-block d-md-flex justify-content-between align-items-center">
                                                <button
                                                    type="submit"
                                                    className='btn mt-4 mb-2 mb-md-5 text-light px-5 py-2 me-2'
                                                    style={{ backgroundColor: '#00917C', fontSize: '24px', fontWeight: 'bold' }}
                                                >
                                                    Register
                                                </button>
                                                <p>
                                                    <Link to="/login" style={{ color: '#00BF7C', textDecoration: 'none' }}>Sudah punya akun</Link>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-2"></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-1 col-md-1"></div>
                    </div>
                    <Footer type="2" />
                </div>
            </div>
        </Fragment>
    );
};

export default SignUp;
