import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import {
    FiUser, FiMail, FiLock, FiArrowRight, FiInstagram, FiYoutube,
    FiUsers, FiImage, FiCheckCircle, FiLoader, FiRefreshCw
} from 'react-icons/fi';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'creator',
        instagram: '',
        youtube: '',
        insta_followers: '',
        insta_posts: '',
        youtube_subscribers: '',
        youtube_videos: '',
        price_post: '',
        price_video: '',
        profile_image: '',
        category: ''
    });

    const [fetchingInsta, setFetchingInsta] = useState(false);
    const [fetchingYt, setFetchingYt] = useState(false);
    const [instaData, setInstaData] = useState(null);
    const [ytData, setYtData] = useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // ── Fetch stats from backend ────────────────────────────────────────────
    const handleFetchInstagram = async () => {
        if (!formData.instagram) return;
        setFetchingInsta(true);
        setInstaData(null);
        try {
            const res = await API.post('/auth/fetch-social', { instagram: formData.instagram });
            const ig = res.data.instagram;
            if (ig) {
                setInstaData(ig);
                // Always populate — user can correct manually
                setFormData(prev => ({
                    ...prev,
                    insta_followers: ig.followers !== undefined ? ig.followers : prev.insta_followers,
                    insta_posts:     ig.posts     !== undefined ? ig.posts     : prev.insta_posts,
                    profile_image:   ig.profile_image || prev.profile_image,
                }));
            } else {
                alert('Could not extract Instagram data. Instagram may have blocked the request. Please fill manually.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to fetch Instagram data. Please enter manually.');
        } finally {
            setFetchingInsta(false);
        }
    };

    const handleFetchYoutube = async () => {
        if (!formData.youtube) return;
        setFetchingYt(true);
        setYtData(null);
        try {
            const res = await API.post('/auth/fetch-social', { youtube: formData.youtube });
            const yt = res.data.youtube;
            if (yt) {
                setYtData(yt);
                // Always populate — user can correct manually
                setFormData(prev => ({
                    ...prev,
                    youtube_subscribers: yt.subscribers !== undefined ? yt.subscribers : prev.youtube_subscribers,
                    youtube_videos:      yt.videos      !== undefined ? yt.videos      : prev.youtube_videos,
                }));
            } else {
                alert('Could not extract YouTube data. Please fill manually.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to fetch YouTube data. Please enter manually.');
        } finally {
            setFetchingYt(false);
        }
    };

    // ── Form submission ─────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const payload = { ...formData };
        if (formData.role === 'creator') {
            payload.insta_followers = parseInt(formData.insta_followers) || 0;
            payload.insta_posts = parseInt(formData.insta_posts) || 0;
            payload.youtube_subscribers = parseInt(formData.youtube_subscribers) || 0;
            payload.youtube_videos = parseInt(formData.youtube_videos) || 0;
            payload.price_post = parseFloat(formData.price_post) || 0;
            payload.price_video = parseFloat(formData.price_video) || 0;
        }

        try {
            const res = await API.post('/auth/register', payload);
            setSuccess(res.data.message || 'Registration successful. Please wait for admin approval.');
            setFormData({
                name: '', email: '', phone: '', password: '', role: 'creator',
                instagram: '', youtube: '',
                insta_followers: '', insta_posts: '',
                youtube_subscribers: '', youtube_videos: '',
                price_post: '', price_video: '', profile_image: '', category: ''
            });
            setInstaData(null);
            setYtData(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ── Reusable fetch button style ─────────────────────────────────────────
    const fetchBtnStyle = (fetched, fetching, hasValue) => ({
        padding: '0 14px',
        height: '44px',
        background: fetched ? 'var(--accent-success, #dcfce7)' : 'var(--bg-card, #fff)',
        color: fetched ? '#166534' : 'var(--text-primary)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        cursor: (fetching || fetched || !hasValue) ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        fontSize: '0.85rem',
        opacity: !hasValue ? 0.5 : 1,
    });

    return (
        <div className="login-page">
            <div className="login-card fade-in" style={{ maxWidth: '620px', margin: '40px auto' }}>
                <div className="login-header">
                    <h1>Create Account</h1>
                    <p>Join Kreaxo and start collaborating</p>
                </div>

                {error && <div className="toast toast-error">{error}</div>}
                {success && <div className="toast toast-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Role selector */}
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>I am a...</label>
                        <div style={{ display: 'flex', gap: 16 }}>
                            {['creator', 'brand'].map(r => (
                                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <input type="radio" name="role" value={r} checked={formData.role === r} onChange={handleChange} />
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Creator Category Dropdown */}
                    {formData.role === 'creator' && (
                        <div className="form-group" style={{ marginBottom: 16 }}>
                            <label className="form-label">Service Provided</label>
                            <select name="category" className="form-input" value={formData.category} onChange={handleChange} required>
                                <option value="" disabled>Select your primary service</option>
                                <option value="UGC Creators">UGC Creators</option>
                                <option value="Photographers">Photographers</option>
                                <option value="Videographers">Videographers</option>
                                <option value="Social Media Managers">Social Media Managers</option>
                                <option value="Editors">Editors</option>
                            </select>
                        </div>
                    )}

                    {/* Name */}
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label className="form-label">{formData.role === 'brand' ? 'Brand Name' : 'Full Name'}</label>
                        <div style={{ position: 'relative' }}>
                            <FiUser style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                            <input type="text" name="name" className="form-input" style={{ paddingLeft: 40 }}
                                placeholder="Your Name or Brand Name" value={formData.name} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                            <input type="email" name="email" className="form-input" style={{ paddingLeft: 40 }}
                                placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label className="form-label">Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)', fontWeight: 600 }}>+</span>
                            <input type="tel" name="phone" className="form-input" style={{ paddingLeft: 40 }}
                                placeholder="Phone number (e.g. 919876543210)" value={formData.phone} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                            <input type="password" name="password" className="form-input" style={{ paddingLeft: 40 }}
                                placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Profile Image */}
                    <div className="form-group" style={{ marginBottom: formData.role === 'creator' ? 16 : 32 }}>
                        <label className="form-label">{formData.role === 'brand' ? 'Brand Logo URL (Optional)' : 'Profile Image URL'}</label>
                        <div style={{ position: 'relative' }}>
                            <FiImage style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                            <input type="url" name="profile_image" className="form-input" style={{ paddingLeft: 40 }}
                                placeholder="https://example.com/photo.jpg" value={formData.profile_image} onChange={handleChange} />
                        </div>
                        {formData.profile_image && (
                            <img src={formData.profile_image} alt="preview"
                                style={{ marginTop: 8, width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                                onError={e => e.target.style.display = 'none'} />
                        )}
                    </div>

                    {/* Creator-only social/pricing section */}
                    {formData.role === 'creator' && (
                        <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiInstagram style={{ color: '#e1306c' }} /> Social Profiles
                                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>(Optional)</span>
                            </h3>

                            {/* ── Instagram ───────────────────────────────────── */}
                            <div className="form-group" style={{ marginBottom: 12 }}>
                                <label className="form-label" style={{ fontSize: '0.85rem' }}>Instagram Profile Link or @handle</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <FiInstagram style={{ position: 'absolute', left: 12, top: 12, color: '#e1306c' }} />
                                        <input type="text" name="instagram" className="form-input" style={{ paddingLeft: 40 }}
                                            placeholder="@username or https://instagram.com/username"
                                            value={formData.instagram}
                                            onChange={e => { handleChange(e); setInstaData(null); }} />
                                    </div>
                                    <button type="button" onClick={handleFetchInstagram}
                                        disabled={!formData.instagram || fetchingInsta || !!instaData}
                                        style={fetchBtnStyle(!!instaData, fetchingInsta, !!formData.instagram)}>
                                        {fetchingInsta ? <><FiRefreshCw style={{ animation: 'spin 1s linear infinite' }} /> Fetching…</> :
                                            instaData ? <><FiCheckCircle /> Fetched</> : 'Fetch'}
                                    </button>
                                </div>
                                {instaData && (
                                    <div style={{ marginTop: 8, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0', fontSize: '0.83rem', color: '#166534', display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {instaData.profile_image && (
                                            <img src={instaData.profile_image} alt="ig" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                                        )}
                                        <span>
                                            ✓ <strong>@{instaData.handle}</strong> — {instaData.followers.toLocaleString()} followers · {instaData.posts.toLocaleString()} posts
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Insta stats (editable) */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Instagram Followers</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiUsers style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                                        <input type="number" name="insta_followers" className="form-input" style={{ paddingLeft: 40 }}
                                            placeholder="e.g. 15000" value={formData.insta_followers} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Instagram Posts</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiImage style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                                        <input type="number" name="insta_posts" className="form-input" style={{ paddingLeft: 40 }}
                                            placeholder="e.g. 120" value={formData.insta_posts} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0 20px' }} />

                            {/* ── YouTube ─────────────────────────────────────── */}
                            <div className="form-group" style={{ marginBottom: 12 }}>
                                <label className="form-label" style={{ fontSize: '0.85rem' }}>YouTube Channel Link or @handle</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <FiYoutube style={{ position: 'absolute', left: 12, top: 12, color: '#ff0000' }} />
                                        <input type="text" name="youtube" className="form-input" style={{ paddingLeft: 40 }}
                                            placeholder="@channel or https://youtube.com/@channel"
                                            value={formData.youtube}
                                            onChange={e => { handleChange(e); setYtData(null); }} />
                                    </div>
                                    <button type="button" onClick={handleFetchYoutube}
                                        disabled={!formData.youtube || fetchingYt || !!ytData}
                                        style={fetchBtnStyle(!!ytData, fetchingYt, !!formData.youtube)}>
                                        {fetchingYt ? <><FiRefreshCw style={{ animation: 'spin 1s linear infinite' }} /> Fetching…</> :
                                            ytData ? <><FiCheckCircle /> Fetched</> : 'Fetch'}
                                    </button>
                                </div>
                                {ytData && (
                                    <div style={{ marginTop: 8, padding: '10px 14px', background: '#fff5f5', borderRadius: 8, border: '1px solid #fecaca', fontSize: '0.83rem', color: '#991b1b' }}>
                                        ✓ <strong>{ytData.channel_name || 'Channel'}</strong>
                                        {ytData.subscribers > 0 && <> — {ytData.subscribers.toLocaleString()} subscribers</>}
                                        {ytData.videos > 0 && <> · {ytData.videos.toLocaleString()} videos</>}
                                    </div>
                                )}
                            </div>

                            {/* YT stats (editable) */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>YouTube Subscribers</label>
                                    <input type="number" name="youtube_subscribers" className="form-input"
                                        placeholder="e.g. 10000" value={formData.youtube_subscribers} onChange={handleChange} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>YouTube Videos</label>
                                    <input type="number" name="youtube_videos" className="form-input"
                                        placeholder="e.g. 50" value={formData.youtube_videos} onChange={handleChange} />
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0 20px' }} />

                            {/* Pricing */}
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>Pricing (per deliverable)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Price per Post (₹)</label>
                                    <input type="number" name="price_post" className="form-input"
                                        placeholder="e.g. 5000" value={formData.price_post} onChange={handleChange} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Price per Video/Reel (₹)</label>
                                    <input type="number" name="price_video" className="form-input"
                                        placeholder="e.g. 12000" value={formData.price_video} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}
                        disabled={loading || !!success}>
                        {loading ? 'Registering...' : `Register as ${formData.role === 'brand' ? 'Brand' : 'Creator'}`} <FiArrowRight />
                    </button>

                    <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
