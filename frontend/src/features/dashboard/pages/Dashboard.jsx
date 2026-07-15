import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hooks/useAuth';

import AccountSettings from './AccountSettings';
import ClientQuotes from './ClientQuotes';
import BlogsManager from './BlogsManager';
import PortfolioManager from './PortfolioManager';
import UserReviews from './UserReviews';
import DisableAccount from './DisableAccount';
import TeamMembers from './TeamMembers';
import defaultUserImage from '../../../../src/assets/images/default.jpg';
import '../dashboard.scss';

// isAdmin pass karke label/icon decide karta hai
const getNavItems = (isAdmin) => [
    { key: 'account', label: 'Account Settings', icon: 'ti-user-cog' },
    ...(isAdmin ? [{ key: 'team', label: 'Team Members', icon: 'ti-users-group' }] : []),
    { key: 'quotes', label: 'Client Quotes', icon: 'ti-receipt-2' },
    { key: 'blogs', label: 'Blogs', icon: 'ti-article' },
    { key: 'portfolio', label: 'Portfolio', icon: 'ti-briefcase' },
    { key: 'reviews', label: 'User Reviews', icon: 'ti-star' },
    {
        key: 'disable',
        label: isAdmin ? 'Disable Account' : 'Delete Account',
        icon: isAdmin ? 'ti-user-off' : 'ti-trash',
    },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, handleLogout } = useAuth();

    const [activeSection, setActiveSection] = useState('account');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdmin = user?.role === 'admin';
    const navItems = getNavItems(isAdmin);

    const renderSection = () => {
        switch (activeSection) {
            case 'account': return <AccountSettings />;
            case 'team': return <TeamMembers />;
            case 'quotes': return <ClientQuotes />;
            case 'blogs': return <BlogsManager />;
            case 'portfolio': return <PortfolioManager />;
            case 'reviews': return <UserReviews />;
            case 'disable': return <DisableAccount />;
            default: return <AccountSettings />;
        }
    };

    const handleNavClick = (key) => {
        setActiveSection(key);
        setSidebarOpen(false);
    };

    const onLogout = async () => {
        await handleLogout();
        navigate('/');
    };

    return (
        <div className="dashboard-wrapper">
            {/* Toggle button sirf tab show ho jab sidebar band ho */}
            {!sidebarOpen && (
                <button
                    className="sidebar-toggle-btn d-lg-none"
                    onClick={() => setSidebarOpen(true)}
                >
                    <i className="ti ti-menu-2"></i>
                </button>
            )}

            <aside className={`dashboard-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
                <button className="sidebar-back-btn" onClick={() => navigate('/')}>
                    <i className="ti ti-arrow-left"></i>
                    <span>Back to site</span>
                </button>

                <div className="sidebar-profile">
                    <img
                        src={user?.userImage || defaultUserImage}
                        alt={user?.username || 'Admin'}
                        className="sidebar-avatar"
                    />
                    <div className="sidebar-profile-text">
                        <h6>{user?.username || 'Admin'}</h6>
                        <span title={user?.email || 'admin@portfolio.com'}>
                            {user?.email || 'admin@portfolio.com'}
                        </span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            className={`sidebar-nav-item ${activeSection === item.key ? 'is-active' : ''}`}
                            onClick={() => handleNavClick(item.key)}
                        >
                            <i className={`ti ${item.icon}`}></i>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button className="sidebar-logout-btn" onClick={onLogout}>
                    <i className="ti ti-logout-2"></i>
                    <span>Logout</span>
                </button>
            </aside>

            {sidebarOpen && (
                <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>
            )}

            <main className="dashboard-content">
                {renderSection()}
            </main>
        </div>
    );
};

export default Dashboard;