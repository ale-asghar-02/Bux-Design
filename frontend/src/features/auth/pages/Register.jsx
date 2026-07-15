import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import '../auth.scss'

const Register = () => {
    const navigate = useNavigate();
    const { handleRegister } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandleRegister = async (e)=> {
        e.preventDefault();

        const formData = {
            username,
            email,
            password
        }

        const response = await handleRegister(formData)
        if(response) { navigate('/') }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="card border p-4 p-md-5" style={{ maxWidth: '450px', width: '100%' }}>

                <h3 className="mb-1 fw-semibold">Create account</h3>
                <p className="text-muted mb-4" style={{ fontSize: '14.5px' }}>Fill in your details below to create your free account and get started in seconds.</p>

                <form onSubmit={submitHandleRegister}>
                    <div className="mb-2">
                        <label className="form-label text-muted" style={{ fontSize: '13px' }}>Username</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="ti ti-user"></i></span>
                            <input type="text" name="username" className="form-control py-2" placeholder="your_name" onChange={(e)=> {setUsername(e.target.value)}} />
                        </div>
                    </div>

                    <div className="mb-2">
                        <label className="form-label text-muted" style={{ fontSize: '13px' }}>Email</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="ti ti-mail"></i></span>
                            <input type="email" name="email" className="form-control py-2" placeholder="you@example.com" onChange={(e)=> {setEmail(e.target.value)}} />
                        </div>
                    </div>

                    <div className="mb-2">
                        <label className="form-label text-muted" style={{ fontSize: '13px' }}>Password</label>
                        <p className="input-group mb-0">
                            <span className="input-group-text"><i className="ti ti-lock"></i></span>
                            <input type={showPassword ? 'text' : 'password'} name="password" className="form-control border-end-0 py-2" placeholder="••••••••" onChange={(e)=> {setPassword(e.target.value)}} />
                            <button type="button" className="input-group-text btn border border-start-0 d-flex align-items-center" onClick={() => setShowPassword(!showPassword)}>
                                <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} style={{ fontSize: '20px' }}></i>
                            </button>
                        </p>
                    </div>

                    <div className='mb-4'>
                        <p className="text-muted text-decoration-none" style={{ fontSize: '13px' }}>Password must be at least 6 character</p>       
                    </div>
                    <button type="submit" className="btn btn-dark w-100 py-2">Create account</button>
                </form>

                <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '15px' }}>
                    Already have an account?{' '}
                    <Link to="/login" className="text-dark fw-medium text-decoration-none">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default Register