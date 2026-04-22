import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiInstagram } from 'react-icons/fi';

export default function Navbar() {
    const { user } = useAuth();
    const location = useLocation();
    
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <div className="container" style={{ width: '100%', justifyContent: 'space-between' }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src="https://res.cloudinary.com/deukqrxtt/image/upload/v1775467694/WhatsApp_Image_2026-04-05_at_7.32.40_PM_pp6llp.jpg" 
                      alt="Kreaxo Logo" 
                      style={{ height: '32px', objectFit: 'contain' }} 
                    />
                </Link>
                <ul className="navbar-links" style={{ display: 'flex', alignItems: 'center' }}>
                    <li className="dropdown" style={{ marginLeft: '12px' }}>
                        <Link to="/services" className={isActive('/services')}>Services</Link>
                        <div className="dropdown-content">
                            <Link to="/services/photographers" className="dropdown-item">Photographers</Link>
                            <Link to="/services/videographers" className="dropdown-item">Videographers</Link>
                            <Link to="/services/ugc" className="dropdown-item">UGC Creators</Link>
                            <Link to="/services/smm" className="dropdown-item">Social Media Managers</Link>
                            <Link to="/services/editors" className="dropdown-item">Editors</Link>
                        </div>
                    </li>
                    <li><Link to="/our-work" className={isActive('/our-work')}>Our Work</Link></li>
                    <li><Link to="/about-us" className={isActive('/about-us')}>About Us</Link></li>
                    <li><Link to="/contact-us" className={isActive('/contact-us')}>Contact Us</Link></li>
                    


                    <li className="dropdown" style={{ marginLeft: 'auto', paddingLeft: '20px' }}>
                        <Link to="/login" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            fontWeight: 700, 
                            fontSize: '0.85rem',
                            color: '#FFF', 
                            background: '#6e63ff94', 
                            padding: '10px 24px', 
                            borderRadius: '50px', 
                            textDecoration: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            boxShadow: '0 4px 14px rgba(161, 29, 37, 0.3)'
                        }}>
                            Login / Register
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
