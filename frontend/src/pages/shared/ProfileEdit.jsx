import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiUser, FiInfo, FiCheckCircle, FiLock, FiMail, FiGlobe, FiBriefcase } from 'react-icons/fi';

export default function ProfileEdit() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', bio: '', category: '', industry: '', website: ''
    });

    useEffect(() => {
        const endpoint = user?.role === 'admin' ? '/me' : (user?.role === 'creator' ? '/creator/profile' : '/brand/profile');
        
        API.get(endpoint)
            .then(res => {
                const data = res.data;
                setFormData({
                    name: data.name || '',
                    email: user?.email || '',
                    bio: data.bio || '',
                    category: data.category || '',
                    industry: data.industry || '',
                    website: data.website || ''
                });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const endpoint = user?.role === 'admin' ? '/admin/profile' : (user?.role === 'creator' ? '/creator/profile' : '/brand/profile');
            await API.put(endpoint, formData);
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
        <DashboardLayout role={user?.role}>
            <div className="loading"><div className="spinner"></div></div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout role={user?.role}>
            <div className="page-header" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 className="page-title">Profile Settings</h1>
                    <p className="page-subtitle">Manage your account information and preferences</p>
                </div>
            </div>

            {toast && (
                <div className={`toast toast-${toast.type}`} style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                    borderRadius: '8px', background: toast.type === 'success' ? 'var(--success)' : 'var(--danger)', 
                    color: 'white', marginBottom: '24px', fontWeight: 600,
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    {toast.type === 'success' ? <FiCheckCircle /> : '⚠️'} {toast.message}
                </div>
            )}

            <div style={{ maxWidth: '800px' }}>
                <div className="card fade-in" style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 800 }}>
                                {formData.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formData.name}</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.role?.toUpperCase()} ACCOUNT</p>
                            </div>
                        </div>

                        <div className="two-col-grid" style={{ gap: '24px' }}>
                            <div className="form-group">
                                <label className="form-label">Full Name / Entity Name</label>
                                <div style={{ position: 'relative' }}>
                                    <FiUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} style={{ paddingLeft: '36px' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="email" className="form-input" name="email" value={formData.email} disabled style={{ paddingLeft: '36px', opacity: 0.7, cursor: 'not-allowed' }} />
                                    <FiLock style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={12} />
                                </div>
                            </div>
                        </div>

                        {user?.role === 'creator' && (
                            <div className="form-group">
                                <label className="form-label">Content Category</label>
                                <select className="form-input" name="category" value={formData.category} onChange={handleChange}>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Tech">Tech</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Gaming">Gaming</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        )}

                        {user?.role === 'brand' && (
                            <>
                                <div className="two-col-grid" style={{ gap: '24px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Industry</label>
                                        <div style={{ position: 'relative' }}>
                                            <FiBriefcase style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input type="text" className="form-input" name="industry" value={formData.industry} onChange={handleChange} style={{ paddingLeft: '36px' }} placeholder="e.g. E-commerce, Retail" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Website</label>
                                        <div style={{ position: 'relative' }}>
                                            <FiGlobe style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input type="url" className="form-input" name="website" value={formData.website} onChange={handleChange} style={{ paddingLeft: '36px' }} placeholder="https://example.com" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label className="form-label">About / Bio</label>
                            <textarea className="form-input" name="bio" rows="4" value={formData.bio} onChange={handleChange} placeholder="Tell us a bit about yourself..." />
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? <span className="spinner-sm"></span> : <FiSave />} Save Changes
                            </button>
                        </div>
                        
                        <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
                            <FiInfo style={{ color: 'var(--info)', flexShrink: 0, marginTop: '2px' }} />
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                                Some information is verified for security. To change your verified email, please contact platform support.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
