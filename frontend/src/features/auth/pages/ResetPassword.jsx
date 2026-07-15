import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import '../auth.scss'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate();
    const { handleResetPassword } = useAuth();

    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submitHandleResetPassword = async (e) => {
        e.preventDefault();

        const response = await handleResetPassword({ token , newPassword , confirmPassword })
        if (response) { navigate('/') }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="card border p-4 p-md-5" style={{ maxWidth: '450px', width: '100%' }}>

                <h3 className="mb-1 fw-semibold">Reset password</h3>
                <p className="text-muted mb-4" style={{ fontSize: '14.5px' }}>Enter your new password below. Make sure it's strong and something you'll remember.</p>

                <form onSubmit={submitHandleResetPassword}>
                    <div className="mb-2">
                        <label className="form-label text-muted" style={{ fontSize: '13px' }}>New Password</label>
                        <p className="input-group mb-0">
                            <span className="input-group-text"><i className="ti ti-lock"></i></span>
                            <input type={showNew ? 'text' : 'password'} name="newPassword" className="form-control border-end-0 py-2" placeholder="••••••••" onChange={(e)=> {setNewPassword(e.target.value)}} />
                            <button type="button" className="input-group-text btn border border-start-0 d-flex align-items-center" onClick={() => setShowNew(!showNew)}>
                                <i className={`ti ${showNew ? 'ti-eye-off' : 'ti-eye'}`} style={{ fontSize: '20px' }}></i>
                            </button>
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted" style={{ fontSize: '13px' }}>Confirm Password</label>
                        <p className="input-group mb-0">
                            <span className="input-group-text"><i className="ti ti-lock-check"></i></span>
                            <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" className="form-control border-end-0 py-2" placeholder="••••••••" onChange={(e)=> {setConfirmPassword(e.target.value)}} />
                            <button type="button" className="input-group-text btn border border-start-0 d-flex align-items-center" onClick={() => setShowConfirm(!showConfirm)}>
                                <i className={`ti ${showConfirm ? 'ti-eye-off' : 'ti-eye'}`} style={{ fontSize: '20px' }}></i>
                            </button>
                        </p>
                    </div>

                    <button type="submit" className="btn btn-dark w-100 py-2">Reset password</button>
                </form>

                <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '15px' }}>
                    Remember your password?{' '}
                    <Link to="/login" className="text-dark fw-medium text-decoration-none">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default ResetPassword