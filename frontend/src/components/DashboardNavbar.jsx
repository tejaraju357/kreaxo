import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardNavbar({ role }) {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        if (path === `/${role}`) return location.pathname === `/${role}` || location.pathname === '/dashboard';
        return location.pathname.includes(path);
    };

    const navLinkStyle = (path) => ({
        color: isActive(path) ? 'var(--text-primary)' : 'var(--text-secondary)',
        textDecoration: 'none',
        padding: '6px 12px',
        borderRadius: '8px',
        background: isActive(path) ? 'var(--bg-card-hover)' : 'transparent',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    });
    
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            height: '64px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src="https://res.cloudinary.com/deukqrxtt/image/upload/v1775467694/WhatsApp_Image_2026-04-05_at_7.32.40_PM_pp6llp.jpg" 
                      alt="Kreaxo Logo" 
                      style={{ height: '32px', objectFit: 'contain' }} 
                    />
                </div>
                
                <nav style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                    <Link to={`/${role}`} style={navLinkStyle(`/${role}`)}>Overview</Link>

                    {role === 'creator' && (
                        <>
                            <Link to="/creator/requests" style={navLinkStyle('/requests')}>Bookings</Link>
                            <Link to="/creator/earnings" style={navLinkStyle('/earnings')}>Earnings</Link>
                            <Link to="/creator/profile" style={navLinkStyle('/profile')}>Profile</Link>
                        </>
                    )}

                    {role === 'brand' && (
                        <>
                            <Link to="/brand/creators" style={navLinkStyle('/creators')}>Discover</Link>
                            <Link to="/brand/requests" style={navLinkStyle('/requests')}>Bookings</Link>
                            <Link to="/brand/payments" style={navLinkStyle('/payments')}>Payments</Link>
                            <Link to="/brand/profile" style={navLinkStyle('/profile')}>Profile</Link>
                        </>
                    )}

                    {role === 'admin' && (
                        <>
                            <Link to="/admin/creators" style={navLinkStyle('/creators')}>Creators</Link>
                            <Link to="/admin/brands" style={navLinkStyle('/brands')}>Brands</Link>
                            <Link to="/admin/collaborations" style={navLinkStyle('/collaborations')}>Collaborations</Link>
                            <Link to="/admin/registrations" style={navLinkStyle('/registrations')}>Approvals</Link>
                            <Link to="/admin/works" style={navLinkStyle('/works')}>Works</Link>
                            <Link to="/admin/profile" style={navLinkStyle('/profile')}>Admin Profile</Link>
                        </>
                    )}
                </nav>
            </div>
            
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: '6px 16px', borderRadius: '8px' }} onMouseEnter={e => e.target.style.background='var(--bg-card-hover)'} onMouseLeave={e => e.target.style.background='none'}>
                Log Out
            </button>
        </div>
    );
}
