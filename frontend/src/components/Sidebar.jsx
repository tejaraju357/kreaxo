import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    FiHome, FiUsers, FiBriefcase, FiImage, FiLink, FiLogOut, 
    FiSettings, FiPackage, FiStar, FiShield, FiCheckSquare, FiTrendingUp
} from 'react-icons/fi';

const menuItems = {
    admin: [
        { path: '/admin', label: 'Dashboard', icon: <FiHome />, exact: true },
        { path: '/admin/registrations', label: 'Registrations', icon: <FiCheckSquare />, badge: 'pending' },
        { path: '/admin/creators', label: 'Creators', icon: <FiUsers /> },
        { path: '/admin/brands', label: 'Brands', icon: <FiBriefcase /> },
        { path: '/admin/works', label: 'Works', icon: <FiImage /> },
        { path: '/admin/collaborations', label: 'Collaborations', icon: <FiLink /> },
    ],
    brand: [
        { path: '/brand', label: 'Dashboard', icon: <FiHome />, exact: true },
        { path: '/brand/creators', label: 'Browse Creators', icon: <FiUsers /> },
        { path: '/brand/requests', label: 'My Bookings', icon: <FiBriefcase /> },
    ],
    creator: [
        { path: '/creator', label: 'Dashboard', icon: <FiHome />, exact: true },
        { path: '/creator/requests', label: 'Proposals', icon: <FiBriefcase /> },
        { path: '/creator/profile', label: 'My Profile', icon: <FiUsers /> },
        { path: '/creator/portfolio', label: 'Portfolio', icon: <FiImage /> },
    ],
};

const roleInfo = {
    admin: { label: 'Admin Panel', gradient: 'var(--accent-gradient)', emoji: '🛡️' },
    brand: { label: 'Brand Portal', gradient: 'var(--accent-gradient)', emoji: '🏢' },
    creator: { label: 'Creator Studio', gradient: 'var(--accent-gradient)', emoji: '✨' },
};

export default function Sidebar({ role }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const items = menuItems[role] || [];
    const info = roleInfo[role] || {};

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (item) => {
        if (item.exact) return location.pathname === item.path;
        return location.pathname === item.path;
    };

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div className="sidebar-logo">Kreaxo</div>
                </Link>
                <div className="sidebar-role-badge">
                    <span style={{ marginRight: '6px' }}>{info.emoji}</span>
                    {info.label}
                </div>
            </div>

            {/* Nav Items */}
            <nav className="sidebar-nav">
                {items.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`sidebar-link ${isActive(item) ? 'active' : ''}`}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="sidebar-link-label">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* User Footer */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{user?.name || 'User'}</div>
                        <div className="sidebar-user-email">{user?.email}</div>
                    </div>
                </div>
                <button
                    className="sidebar-link sidebar-logout"
                    onClick={handleLogout}
                    style={{ width: '100%', marginTop: '8px' }}
                    id="sidebar-logout"
                >
                    <span className="icon"><FiLogOut /></span>
                    <span className="sidebar-link-label">Logout</span>
                </button>
            </div>
        </aside>
    );
}
