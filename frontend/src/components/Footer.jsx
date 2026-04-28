import { Link } from 'react-router-dom';
import { FiInstagram } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="footer" style={{ 
            backgroundImage: 'linear-gradient(rgba(203, 212, 230, 0.92), rgba(189, 205, 236, 0.92)), url("https://res.cloudinary.com/deukqrxtt/image/upload/v1775467689/WhatsApp_Image_2026-04-05_at_7.32.18_PM_c1y6ux.jpg")', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#000000ff', 
            padding: '100px 0 60px 0', 
            borderTop: '1px solid rgba(255,255,255,0.1)' 
        }}>
            <div className="container footer-grid" style={{ maxWidth: '1200px' }}>
                
                {/* Brand Column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                         <a href="https://www.instagram.com/kreaxo/" target="_blank" rel="noopener noreferrer" style={{ 
                             width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(226, 20, 216, 0.2)', 
                             display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#da0fecff', transition: '0.3s'
                         }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }} 
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(70, 63, 66, 0.2)'; e.currentTarget.style.color = '#920e0eff'; }}>
                             <FiInstagram size={20} />
                         </a>
                    </div>
                    <p style={{ 
                        color: 'rgba(78, 74, 74, 0.7)', 
                        lineHeight: 1.6, 
                        fontSize: '1rem', 
                        fontStyle: 'italic',
                        fontFamily: 'var(--font-serif)',
                        maxWidth: '350px'
                    }}>
                        A creative agency specializing in branding, web development, motion graphics, and art direction to bring ideas to life.
                    </p>
                </div>

                {/* Quick Links Column */}
                <div>
                    <h4 style={{ 
                        fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', 
                        letterSpacing: '2px', marginBottom: '40px' 
                    }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li><Link to="/" style={{ color: '#181818ff', textDecoration: 'none', fontWeight: 600 }}>HOME</Link></li>
                        <li><Link to="/about-us" style={{ color: '#181818ff', textDecoration: 'none', fontWeight: 600 }}>ABOUT US</Link></li>
                        <li><Link to="/contact-us" style={{ color: '#181818ff', textDecoration: 'none', fontWeight: 600 }}>CONTACT</Link></li>
                        <li><Link to="/services" style={{ color: '#181818ff', textDecoration: 'none', fontWeight: 600 }}>OUR SERVICES</Link></li>
                    </ul>
                </div>

                {/* Our Services Column */}
                <div>
                    <h4 style={{ 
                        fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', 
                        letterSpacing: '2px', marginBottom: '40px' 
                    }}>Our Services</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li><Link to="/services" style={{ color: '#141414ff', textDecoration: 'none', fontWeight: 600 }}>PHOTOGRAPHY</Link></li>
                        <li><Link to="/services" style={{ color: '#141414ff', textDecoration: 'none', fontWeight: 600 }}>VIDEOGRAPHY</Link></li>
                        <li><Link to="/services" style={{ color: '#141414ff', textDecoration: 'none', fontWeight: 600 }}>UI / UX DESIGN</Link></li>
                        <li><Link to="/services" style={{ color: '#141414ff', textDecoration: 'none', fontWeight: 600 }}>3D ANIMATION</Link></li>
                    </ul>
                </div>

            </div>

             {/* Minimal Bottom Bar */}
             <div className="container footer-bottom" style={{ 
                 marginTop: '80px', 
                 paddingTop: '32px', 
                 borderTop: '1px solid rgba(255,255,255,0.1)', 
                 maxWidth: '1200px'
             }}>
                 <p style={{ color: 'rgba(85, 81, 81, 0.4)', fontSize: '0.8rem', letterSpacing: '1px' }}>
                    © {new Date().getFullYear()} KREAXO. ALL RIGHTS RESERVED.
                 </p>
                 <div style={{ display: 'flex', gap: '24px' }}>
                    <Link to="/terms" style={{ color: 'rgba(65, 61, 61, 0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>TERMS</Link>
                    <Link to="/privacy" style={{ color: 'rgba(65, 61, 61, 0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>PRIVACY</Link>
                 </div>
             </div>

            {/* Floating WhatsApp Button */}
            <a href="https://wa.me/919392731998" target="_blank" rel="noopener noreferrer" style={{ 
                position: 'fixed', bottom: '30px', right: '30px', background: '#25D366', color: '#474545ff', 
                width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 1000, transition: '0.3s' 
            }} className="hover-float">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="30" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
            </a>
        </footer>
    );
}
