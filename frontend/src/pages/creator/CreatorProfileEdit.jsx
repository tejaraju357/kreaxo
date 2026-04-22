import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiUser, FiInfo, FiImage, FiSettings, FiInstagram, FiYoutube, FiCheckCircle } from 'react-icons/fi';

export default function CreatorProfileEdit() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        name: '', bio: '', category: '',
        instagram: '', youtube: '', profile_image: '',
        followers: 0, posts: 0, is_public: false
    });

    useEffect(() => {
        API.get('/creator/profile')
            .then(res => {
                const prof = res.data || null;
                setProfile(prof);
                if (prof) {
                    setFormData({
                        name: prof.name || '',
                        bio: prof.bio || '',
                        category: prof.category || '',
                        instagram: prof.instagram || '',
                        youtube: prof.youtube || '',
                        profile_image: prof.profile_image || '',
                        followers: prof.followers || 0,
                        posts: prof.posts || 0,
                        is_public: prof.is_public || false
                    });
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await API.put('/creator/profile', formData);
            setProfile(res.data);
            showToast('Profile updated successfully!', 'success');
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to update profile', 'error');
        }
        setSaving(false);
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    if (loading) return (
        <DashboardLayout role="creator">
            <div className="loading"><div className="spinner"></div></div>
        </DashboardLayout>
    );

    if (!profile) return (
        <DashboardLayout role="creator">
            <div className="empty-state card">
                <div className="icon">⚠️</div>
                <h3>Account setup incomplete</h3>
                <p>Please ask the admin to approve your account and initialize your Creator Profile.</p>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout role="creator">
            <div className="page-header" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 className="page-title">My Profile</h1>
                    <p className="page-subtitle">Manage how brands see you on Kreaxo</p>
                </div>
            </div>

            {toast && (
                <div className={`toast toast-${toast.type}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px', background: toast.type === 'success' ? '#10b981' : '#ef4444', color: 'white', marginBottom: '24px', fontWeight: 600 }}>
                    {toast.type === 'success' ? <FiCheckCircle /> : '⚠️'} {toast.message}
                </div>
            )}

            <div className="two-col-grid" style={{ gap: '32px' }}>
                {/* Left Column - Form */}
                <div className="card fade-in" style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiUser /> Basic Information
                        </h2>

                        <div className="form-group">
                            <label className="form-label">Display Name *</label>
                            <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="two-col-grid" style={{ gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Category *</label>
                                <select className="form-input" name="category" value={formData.category} onChange={handleChange} required>
                                    <option value="">Select a category</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Tech">Tech</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Food">Food</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Fitness">Fitness</option>
                                    <option value="Beauty">Beauty</option>
                                    <option value="Gaming">Gaming</option>
                                    <option value="Photography">Photography</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Profile Image URL</label>
                                <div className="input-with-icon">
                                    <FiImage className="input-icon" />
                                    <input type="url" className="form-input input-icon-left" name="profile_image" value={formData.profile_image} onChange={handleChange} placeholder="https://..." />
                                </div>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label className="form-label">Bio / About Me</label>
                            <textarea className="form-input" name="bio" rows="4" value={formData.bio} onChange={handleChange} placeholder="Tell brands about your content style, audience, and what makes you unique..." />
                        </div>

                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                            <FiInstagram /> Social Media & Stats
                        </h2>

                        <div className="two-col-grid" style={{ gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Instagram Handle</label>
                                <div className="input-with-icon">
                                    <span style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>@</span>
                                    <input type="text" className="form-input input-icon-left" name="instagram" value={formData.instagram} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">YouTube Channel URL</label>
                                <div className="input-with-icon">
                                    <FiYoutube className="input-icon" />
                                    <input type="url" className="form-input input-icon-left" name="youtube" value={formData.youtube} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Instagram Followers</label>
                                <input type="number" className="form-input" name="followers" value={formData.followers} onChange={handleChange} min="0" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Instagram Posts</label>
                                <input type="number" className="form-input" name="posts" value={formData.posts} onChange={handleChange} min="0" />
                            </div>
                        </div>

                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                            <FiSettings /> Visibility Settings
                        </h2>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                            <input type="checkbox" id="is_public" name="is_public" checked={formData.is_public} onChange={handleChange} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                            <div style={{ flex: 1 }}>
                                <label htmlFor="is_public" style={{ fontWeight: 700, cursor: 'pointer', display: 'block' }}>Make Profile Public</label>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>When public, brands can find you in the Discovery tab and send you collaboration requests.</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ gap: '8px' }}>
                                {saving ? <><span className="spinner-sm"></span> Saving...</> : <><FiSave /> Save Profile</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Column - Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card fade-in" style={{ animationDelay: '0.1s', position: 'sticky', top: '24px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Profile Preview</h2>
                            <span style={{ fontSize: '0.8rem', background: formData.is_public ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: formData.is_public ? '#10b981' : '#f59e0b', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>
                                {formData.is_public ? '🟢 Live' : '🟡 Hidden'}
                            </span>
                        </div>

                        <div className="profile-avatar" style={{ margin: '0 auto 16px', width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--border)' }}>
                            {formData.profile_image ? (
                                <img src={formData.profile_image} alt={formData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 800 }}>
                                    {formData.name?.charAt(0)?.toUpperCase() || 'C'}
                                </div>
                            )}
                        </div>

                        <h3 style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>
                            {formData.name || 'Your Name'}
                        </h3>
                        
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.8rem', padding: '4px 12px', borderRadius: '20px' }}>
                                {formData.category || 'Category'}
                            </span>
                        </div>

                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, marginBottom: '24px', minHeight: '60px' }}>
                            {formData.bio || 'Your bio will appear here. Write something engaging to attract top brands!'}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                    {formData.followers > 1000 ? (formData.followers / 1000).toFixed(1) + 'K' : formData.followers}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Followers</div>
                            </div>
                            <div style={{ width: '1px', background: 'var(--border)' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                    {formData.posts}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Posts</div>
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '24px', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <FiInfo style={{ flexShrink: 0, marginTop: '2px', color: '#8b5cf6' }} />
                            <div>This is a preview of how brands will see your card when browsing the talent pool.</div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
