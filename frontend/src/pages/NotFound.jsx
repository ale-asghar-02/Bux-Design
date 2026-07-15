import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-icon">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#dadce0" strokeWidth="1.5" />
                    <path d="M9 9L15 15M15 9L9 15" stroke="#5f6368" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>
            <h1>404</h1>
            <p className="mb-0">This page can't be found</p>
            <p className="text-body-secondary">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill">
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;