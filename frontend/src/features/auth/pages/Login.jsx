import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import '../auth.scss'

const Login = () => {
    const navigate = useNavigate();
    const { loading , handleLogin , handleForgotPassword } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [forgotEmail, setForgotEmail] = useState('');

    const submitHandleLogin = async (e) => {
        e.preventDefault();

        const formData = { email , password }

        const response = await handleLogin( formData );
        if(response) { navigate('/') }
    }

    const submitHandleForgotPassword = async (e) => {
        e.preventDefault();
        const response = await handleForgotPassword({ email: forgotEmail });
        if (response) setShowModal(false);
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="card border p-4 p-md-5" style={{ maxWidth: '450px', width: '100%' }}>

                <h3 className="mb-1 fw-semibold">Welcome back</h3>
                <p className="text-muted mb-4" style={{ fontSize: '14.5px' }}>Fill in your details below to sign in to your account and pick up where you left off.</p>

                <form onSubmit={submitHandleLogin}>
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

                    <div className="mb-4">
                        <p onClick={() => setShowModal(true)} className="text-muted text-decoration-none" style={{ fontSize: '13px' , cursor: 'pointer' }}>Forgot password?</p>
                    </div>

                    <button type="submit" className="btn btn-dark w-100 py-2">Sign in</button>
                </form>

                <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '15px' }}>
                    Don't have an account?{' '}
                    <Link to="/register" className="text-dark fw-medium text-decoration-none">Create account</Link>
                </p>
            </div>

            {/* Forgot Password Modal */}
            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} style={{ backgroundColor: showModal ? 'rgba(0,0,0,0.5)' : '' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-semibold">Forgot password</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p className="text-muted" style={{ fontSize: '14px' }}>Enter your email address and we'll send you a password reset link.</p>
                            <div className="input-group">
                                <span className="input-group-text"><i className="ti ti-mail"></i></span>
                                <input type="email" className="form-control py-2" placeholder="you@example.com" onChange={(e) => setForgotEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button type="button" className="btn btn-dark w-100 py-2" onClick= {submitHandleForgotPassword}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                                ) : 'Send verification link'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login