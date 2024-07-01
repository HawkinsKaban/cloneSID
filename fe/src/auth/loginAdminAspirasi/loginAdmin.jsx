import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../shared/layout/navBar/index'
import Footer from '../../shared/layout/footer/index'
import axios from 'axios';


const LoginAdmin = () => {
    const port = import.meta.env.VITE_BASE_API_URL2;
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    });
    localStorage.removeItem('token');

    const { name, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${port}v1/admin/login-admin`, {
                name: name,
                password: password
            });

            if (res.data && res.data.data && res.data.data.token) {
                localStorage.setItem('token', res.data.data.token);
                window.location.href = '/informasi-desa';
            } else {
                throw new Error('Invalid response from server');
            }

        } catch (err) {
            console.error(err);
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
                                <p className='text-center' style={{ fontSize: '45px', fontWeight: 'bold' }}>LOGIN ADMIN</p>
                                <form onSubmit={e => onSubmit(e)}>
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
                                                    onChange={e => onChange(e)}
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
                                                    onChange={e => onChange(e)}
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
        </Fragment >
    )
}

export default LoginAdmin;
