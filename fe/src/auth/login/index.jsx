import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import NavBar from '../../shared/layout/navBar';
import Footer from '../../shared/layout/footer';
import axios from 'axios';
import './index.css';

const SignUp = () => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    });
    const [response, setResponse] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); 

    localStorage.removeItem('token');

    const { name, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        try {
            const res = await axios.post(`${port}v1/warga/login`, {
                name: name.toUpperCase(),
                password: password
            });

            setResponse(res);

            if (res.data && res.data.data && res.data.data.token) {
                localStorage.setItem('token', res.data.data.token);
                navigate('/informasi-desa');
            } else {
                console.error('Token not found in the response');
                setErrorMessage('Login successful, but token not found. Please try again.');
            }
        } catch (err) {
            console.error('Error during login:', err);
            if (err.response && err.response.status === 400) {
                setErrorMessage('Nama atau password tidak ditemukan');
            } else if (err.response && err.response.status === 404) {
                setErrorMessage('User not found');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
            setResponse(err.response ? err.response.status : 'Unknown error');
        }
    };

    
    return (
        <Fragment>
            <div className="container-fluid login-container p-0 ">
                <div className="container-fluid login-container-background p-0 ">
                    <NavBar type={1}/>
                    <div className="row mt-0 mt-md-5">
                        <div className="col-1 col-md-2"></div>
                        <div className="col-10 col-md-8 mb-5">
                            <div className="card card-form-login text-light pt-5 ">
                                <p className='text-center' style={{ fontSize: '45px', fontWeight: 'bold' }}>LOGIN</p>
                                {errorMessage && (
                                    <div className="alert alert-danger text-center" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <form onSubmit={onSubmit}>
                                    <div className="row">
                                        <div className="col-1"></div>
                                        <div className="col-10">
                                            <div className="NIK mb-2">
                                                <p style={{ fontSize: '24px' }} className='mb-0'>Nama</p>
                                                <input
                                                    className='py-3 ps-3'
                                                    style={{ width: '100%', borderRadius: '0.5vw' }}
                                                    type="text"
                                                    placeholder="Masukkan Nama"
                                                    name="name"
                                                    value={name}
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
                                            <div className="btn-warp d-block d-sm-flex justify-content-between align-items-center">
                                                <button
                                                    type="submit"
                                                    className='btn mt-4 mb-3 mb-sm-5 text-light px-5 py-2'
                                                    style={{ backgroundColor: '#00917C', fontSize: '24px', fontWeight: 'bold' }}
                                                >
                                                    Login
                                                </button>
                                                <div className="text-warp d-block d-sm-flex justify-content-between align-items-center mb-5 mb-sm-0">
                                                    <p className='mx-0 mx-sm-3'>
                                                        <Link to="/forgot-password" style={{ color: '#00BF7C', textDecoration: 'none' }}>Lupa Pasword ?</Link>
                                                    </p>
                                                    <p className='mx-0 mx-sm-3'>
                                                        <Link to="/sign-up" style={{ color: '#00BF7C', textDecoration: 'none' }}>Belum punya akun ?</Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-2"></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-1 col-md-1"></div>
                    </div>
                    <Footer type="2"/>
                </div>
            </div>
        </Fragment>
    );
};

export default SignUp;
