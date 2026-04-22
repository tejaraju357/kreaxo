import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);
            switch (user.role) {
                case 'admin': navigate('/admin'); break;
                case 'brand': navigate('/brand'); break;
                case 'creator': navigate('/creator'); break;
                default: navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (role) => {
        const creds = {
            admin: { email: 'priyathamtella@gmail.com', password: 'reechomedia' },
            brand: { email: 'nike@brand.com', password: 'brand123' },
            creator: { email: 'alice@creator.com', password: 'creator123' },
        };
        setEmail(creds[role]?.email || '');
        setPassword(creds[role]?.password || '');
    };

    const quotes = [
        { icon: '🚀', title: 'Launch Your Brand', desc: 'Connect with 2,400+ verified creators ready to amplify your message.' },
        { icon: '🤝', title: 'Collaborate Smarter', desc: 'From UGC to full campaigns — find the perfect creative match.' },
        { icon: '✨', title: 'Build Together', desc: 'Brands and creators growing side by side on one platform.' },
        { icon: '📈', title: 'Scale Your Reach', desc: 'Tap into millions of engaged followers across every niche.' },
    ];

    const [activeQuote] = useState(() => Math.floor(Math.random() * quotes.length));

    return (
        <div className="login-page">
            {/* ── Left Panel ── */}
            <div className="login-left" style={{
                background: 'linear-gradient(145deg, #1A0F2E 0%, #2D1654 40%, #6c3ff5 75%, #C084FC 100%)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '48px 44px',
                minHeight: '100vh',
            }}>
                {/* Animated blobs */}
                <div style={{
                    position: 'absolute', top: '-100px', right: '-80px',
                    width: 380, height: 380, borderRadius: '50%',
                    background: 'rgba(192,132,252,0.22)', filter: 'blur(70px)',
                    animation: 'floatBlob 7s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute', bottom: '40px', left: '-80px',
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'rgba(168,85,247,0.18)', filter: 'blur(55px)',
                    animation: 'floatBlob 9s ease-in-out infinite reverse',
                }} />
                <div style={{
                    position: 'absolute', top: '50%', left: '35%',
                    width: 200, height: 200, borderRadius: '50%',
                    background: 'rgba(216,180,254,0.10)', filter: 'blur(40px)',
                    animation: 'floatBlob 12s ease-in-out infinite',
                }} />

                {/* Top: Real Logo */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center',
                        background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)',
                        borderRadius: 16, padding: '10px 18px',
                        border: '1px solid rgba(192,132,252,0.3)',
                        marginBottom: 44,
                    }}>
                        <img
                            src="https://res.cloudinary.com/deukqrxtt/image/upload/v1775467694/WhatsApp_Image_2026-04-05_at_7.32.40_PM_pp6llp.jpg"
                            alt="Kreaxo"
                            style={{ height: 36, objectFit: 'contain', borderRadius: 6 }}
                        />
                    </div>

                    <h2 style={{
                        color: '#F5F3EE', fontWeight: 900,
                        fontSize: 'clamp(1.9rem, 3vw, 2.8rem)',
                        lineHeight: 1.15, marginBottom: 18,
                        letterSpacing: '-0.5px',
                        fontFamily: "'Playfair Display', serif",
                    }}>
                        Welcome to<br />
                        <span style={{ color: '#ffffff' }}>Kreaxo</span>
                    </h2>
                    <p style={{ color: 'rgba(245,243,238,0.72)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 300 }}>
                        Where brands meet world-class creative talent. Build, collaborate, and grow — together.
                    </p>
                </div>

                {/* Middle: Quote Card */}
                <div style={{ position: 'relative', zIndex: 2, margin: '8px 0' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(18px)',
                        border: '1px solid rgba(255,255,255,0.22)',
                        borderRadius: 22, padding: '28px',
                    }}>
                        <div style={{
                            fontSize: '2rem', marginBottom: 12,
                            width: 48, height: 48, borderRadius: 12,
                            background: 'rgba(255,255,255,0.18)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{quotes[activeQuote].icon}</div>
                        <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
                            {quotes[activeQuote].title}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                            {quotes[activeQuote].desc}
                        </div>
                    </div>

                    {/* Category pills */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                        {['🎨 UGC', '📸 Photography', '🎬 Video', '📱 Social'].map(tag => (
                            <span key={tag} style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.35)',
                                color: '#ffffff', fontSize: '0.76rem', fontWeight: 600,
                                padding: '5px 12px', borderRadius: 999,
                            }}>{tag}</span>
                        ))}
                    </div>
                </div>

                {/* Bottom: Social proof */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', gap: 28, marginBottom: 28 }}>
                        {[
                            { val: '2,400+', label: 'Creators' },
                            { val: '840+', label: 'Brands' },
                            { val: '12K+', label: 'Collabs' },
                        ].map(s => (
                            <div key={s.label}>
                                <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>{s.val}</div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.73rem', marginTop: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.22)',
                        borderRadius: 14, padding: '14px 18px',
                    }}>
                        <div style={{ display: 'flex' }}>
                            {['#f0abfc', '#e879f9', '#c026d3', '#9333ea'].map((c, i) => (
                                <div key={c} style={{
                                    width: 30, height: 30, borderRadius: '50%',
                                    background: c, border: '2px solid rgba(255,255,255,0.4)',
                                    marginLeft: i === 0 ? 0 : -10,
                                }} />
                            ))}
                        </div>
                        <div>
                            <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.83rem' }}>Join thousands of creators & brands</div>
                            <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.75rem', marginTop: 2 }}>Trusted by top Indian brands</div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes floatBlob {
                        0%, 100% { transform: translateY(0px) scale(1); }
                        50% { transform: translateY(-26px) scale(1.07); }
                    }
                `}</style>
            </div>

            {/* ── Right Panel – Form ── */}
            <div className="login-right">
                <div className="login-form-wrapper">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div className="login-form-logo">K</div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>
                            Welcome back
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Sign in to your Kreaxo account
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-with-icon">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    className="form-input input-icon-left"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    id="login-email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-with-icon">
                                <FiLock className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input input-icon-left input-icon-right"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    id="login-password"
                                />
                                <button
                                    type="button"
                                    className="input-icon-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: '8px', gap: '10px' }}
                            disabled={loading}
                            id="login-submit"
                        >
                            {loading ? (
                                <><span className="spinner-sm"></span> Signing in...</>
                            ) : (
                                <> Sign In <FiArrowRight /></>
                            )}
                        </button>
                    </form>

                    <div className="login-demo">
                        <p>Quick Demo Access</p>
                        <div className="login-demo-btns">
                            <button className="demo-btn demo-admin" onClick={() => fillDemo('admin')} id="demo-admin">Admin</button>
                            <button className="demo-btn demo-brand" onClick={() => fillDemo('brand')} id="demo-brand">Brand</button>
                            <button className="demo-btn demo-creator" onClick={() => fillDemo('creator')} id="demo-creator">Creator</button>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                            Register here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
