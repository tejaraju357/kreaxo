import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { FiPlus, FiTrash2, FiX, FiExternalLink } from 'react-icons/fi';

export default function ManageCreators() {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        email: '', password: '', name: '', bio: '', category: '',
        followers: '', instagram: '', youtube: '', profile_image: ''
    });

    const fetchCreators = () => {
        API.get('/admin/creators')
            .then(res => setCreators(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCreators(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/creators', { ...form, followers: parseInt(form.followers) || 0 });
            setShowModal(false);
            setForm({ email: '', password: '', name: '', bio: '', category: '', followers: '', instagram: '', youtube: '', profile_image: '' });
            fetchCreators();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create creator');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this creator?')) return;
        try {
            await API.delete(`/admin/creators/${id}`);
            fetchCreators();
        } catch (err) {
            alert('Failed to delete creator');
        }
    };

    return (
        <DashboardLayout role="admin">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Manage Creators</h1>
                        <p className="page-subtitle">{creators.length} creators registered</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <FiPlus /> Add Creator
                    </button>
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : creators.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">👥</div>
                        <h3>No creators yet</h3>
                        <p>Add your first content creator to get started</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {creators.map(creator => (
                            <div key={creator.id} className="profile-card fade-in">
                                <div className="profile-avatar">
                                    {creator.profile_image ? (
                                        <img src={creator.profile_image} alt={creator.name} />
                                    ) : (
                                        creator.name?.charAt(0)?.toUpperCase()
                                    )}
                                </div>
                                <Link to={`/profile/${creator.id}`} target="_blank" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                    <h3 className="profile-name">{creator.name}</h3>
                                    <FiExternalLink size={14} color="var(--text-muted)" />
                                </Link>
                                <div className="profile-meta">
                                    {creator.category && <span className="badge badge-category">{creator.category}</span>}
                                    {creator.followers > 0 && (
                                        <span style={{ marginLeft: 8, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            {creator.followers.toLocaleString()} followers
                                        </span>
                                    )}
                                </div>
                                {creator.bio && <p className="profile-bio">{creator.bio}</p>}
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                                    {creator.user?.email}
                                </div>
                                <div className="profile-actions">
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(creator.id)}>
                                        <FiTrash2 /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Creator Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Add New Creator</h2>
                                <button className="modal-close" onClick={() => setShowModal(false)}>
                                    <FiX />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="two-col-grid">
                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="creator@email.com" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Password *</label>
                                        <input className="form-input" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Creator name" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea className="form-input" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Short bio about the creator" />
                                </div>
                                <div className="two-col-grid">
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <input className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Tech, Lifestyle" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Followers</label>
                                        <input className="form-input" type="number" value={form.followers} onChange={e => setForm({ ...form, followers: e.target.value })} placeholder="0" />
                                    </div>
                                </div>
                                <div className="two-col-grid">
                                    <div className="form-group">
                                        <label className="form-label">Instagram</label>
                                        <input className="form-input" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="@handle" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">YouTube</label>
                                        <input className="form-input" value={form.youtube} onChange={e => setForm({ ...form, youtube: e.target.value })} placeholder="Channel URL" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Profile Image URL</label>
                                    <input className="form-input" value={form.profile_image} onChange={e => setForm({ ...form, profile_image: e.target.value })} placeholder="https://..." />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add Creator</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        </DashboardLayout>
    );
}
