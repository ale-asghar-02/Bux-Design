import { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';

const STORAGE_KEY = 'gateLockState';
const LOCKOUT_DURATIONS = [60, 30 * 60, 60 * 60];
const MAX_ATTEMPTS = 5;

const getDefaultState = () => ({
    attemptsLeft: MAX_ATTEMPTS,
    lockoutTier: 0,
    lockoutUntil: null,
});

const loadState = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : getDefaultState();
    } catch {
        return getDefaultState();
    }
};

const saveState = (state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const ProtectedRoute = ({ children }) => {
    const [code, setCode] = useState('');
    const [gateState, setGateState] = useState(loadState);
    const [remainingLock, setRemainingLock] = useState(0);
    const [isVerified, setIsVerified] = useState(false);
    const [checking, setChecking] = useState(true);
    const [forgotLoading, setForgotLoading] = useState(false);
    const intervalRef = useRef(null);

    const { handleVerifyGateCode, handleForgotGateCode, handleGateStatus, gateLoading } = useAuth();

    const isLocked = !!gateState.lockoutUntil && gateState.lockoutUntil > Date.now();

    useEffect(() => {
        const check = async () => {
            try {
                const ok = await handleGateStatus();
                if (ok) setIsVerified(true);
            } catch {
                setIsVerified(false);
            } finally {
                setChecking(false);
            }
        };
        check();
    }, []);

    useEffect(() => {
        if (!gateState.lockoutUntil) return;

        const tick = () => {
            const diff = gateState.lockoutUntil - Date.now();
            if (diff <= 0) {
                clearInterval(intervalRef.current);
                const resetAttempts = {
                    attemptsLeft: MAX_ATTEMPTS,
                    lockoutTier: gateState.lockoutTier,
                    lockoutUntil: null,
                };
                setGateState(resetAttempts);
                saveState(resetAttempts);
                setRemainingLock(0);
            } else {
                setRemainingLock(Math.ceil(diff / 1000));
            }
        };

        tick();
        intervalRef.current = setInterval(tick, 1000);
        return () => clearInterval(intervalRef.current);
    }, [gateState.lockoutUntil, gateState.lockoutTier]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLocked || !code || gateLoading) return;

        const success = await handleVerifyGateCode({ code });

        if (success) {
            const resetState = getDefaultState();
            setGateState(resetState);
            saveState(resetState);
            setIsVerified(true);
            return;
        }

        const attemptsLeft = gateState.attemptsLeft - 1;

        if (attemptsLeft <= 0) {
            const tierIndex = Math.min(gateState.lockoutTier, LOCKOUT_DURATIONS.length - 1);
            const lockoutSeconds = LOCKOUT_DURATIONS[tierIndex];
            const nextState = {
                attemptsLeft: 0,
                lockoutTier: Math.min(gateState.lockoutTier + 1, LOCKOUT_DURATIONS.length - 1),
                lockoutUntil: Date.now() + lockoutSeconds * 1000,
            };
            setGateState(nextState);
            saveState(nextState);
        } else {
            const nextState = { ...gateState, attemptsLeft };
            setGateState(nextState);
            saveState(nextState);
        }

        setCode('');
    };

    const handleForgotClick = async () => {
        if (isLocked || gateLoading || forgotLoading) return;
        setForgotLoading(true);
        try {
            await handleForgotGateCode();
        } finally {
            setForgotLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" />
                    <p className="text-muted small">Checking access...</p>
                </div>
            </div>
        );
    }

    if (isVerified) return children;

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-2">
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card-body p-5">

                    <div className="text-center mb-4">
                        <div className="d-inline-flex align-items-center justify-content-center border rounded-circle mb-3"
                            style={{
                                width: '64px',
                                height: '64px',
                            }}>
                            <i className="ti ti-lock fs-3"></i>
                        </div>
                        <h3 className="fw-bold mb-1">Private Access</h3>
                        <p className="text-muted small mb-0">Enter your access code to continue</p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-2">
                            <label className="form-label text-muted small">Access Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                disabled={isLocked || gateLoading}
                                placeholder="Enter your code"
                                className="form-control py-2"
                            />
                        </div>

                        {!isLocked && gateState.attemptsLeft < MAX_ATTEMPTS && (
                            <div className="text-danger small mb-4">
                                {gateState.attemptsLeft} attempt{gateState.attemptsLeft !== 1 ? 's' : ''} remaining
                            </div>
                        )}

                        {isLocked && (
                            <div className="text-danger small mb-4">
                                Too many attempts. Try again in{' '}
                                <span className="fw-medium">{formatTime(remainingLock)}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLocked || gateLoading || !code}
                            className="btn btn-dark col-12 py-2 mb-3"
                            style={{
                                opacity: isLocked || gateLoading || !code ? 0.6 : 1,
                            }}>
                            {gateLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify & Continue'
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleForgotClick}
                                disabled={isLocked || gateLoading || forgotLoading}
                                className="btn btn-link text-muted small text-decoration-none p-0"
                            >
                                {forgotLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                                        Sending...
                                    </>
                                ) : (
                                    'Forgot your code?'
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProtectedRoute;