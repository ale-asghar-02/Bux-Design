import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ResetCode = () => {
    const { token } = useParams(); // assumes route like /reset-gate-code/:token
    const navigate = useNavigate();

    const [newCode, setNewCode] = useState('');
    const [error, setError] = useState('');

    const { handleResetGateCode, loading } = useAuth(); // adjust name if different in your useAuth

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // digits only
        setNewCode(value);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!/^\d{6,}$/.test(newCode)) {
            setError('Code must be at least 6 digits');
            return;
        }

        const success = await handleResetGateCode({ token, newCode });

        if (success) {
            navigate('/login');
        } else {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card-body p-5">

                    <div className="text-center mb-4">
                        <div className="d-inline-flex align-items-center justify-content-center border rounded-circle mb-3"
                            style={{
                                width: '64px',
                                height: '64px',
                            }}>
                            <i className="ti ti-key fs-3"></i>
                        </div>
                        <h3 className="fw-bold mb-1">Reset Access Code</h3>
                        <p className="text-muted small mb-0">Enter a new access code below</p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-2">
                            <label className="form-label text-muted small">New Access Code</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={newCode}
                                onChange={handleChange}
                                disabled={loading}
                                placeholder="Enter new code"
                                className="form-control py-2"
                            />
                        </div>

                        <div className={`small mb-4 ${error ? 'text-danger' : 'text-muted'}`}>
                            {error ? error : 'Code must contain only numbers and be at least 6 digits'}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newCode}
                            className="btn btn-dark col-12 py-2"
                            style={{
                                opacity: loading || !newCode ? 0.6 : 1,
                            }}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                                    Resetting...
                                </>
                            ) : (
                                'Reset Code'
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetCode;