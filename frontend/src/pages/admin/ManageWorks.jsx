import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

export default function ManageWorks() {
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', image_url: '', category: '', is_featured: false
    });

    const fetchWorks = () => {
        API.get('/admin/works')
            .then(res => setWorks(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchWorks(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/works', form);
            setShowModal(false);
            setForm({ title: '', description: '', image_url: '', category: '', is_featured: false });
            fetchWorks();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create work');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this work?')) return;
        try {
            await API.delete(`/admin/works/${id}`);
            fetchWorks();
        } catch (err) {
            alert('Failed to delete work');
        }
    };

    return (
        <DashboardLayout role="admin">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Manage Works</h1>
                        <p className="page-subtitle">{works.length} portfolio items</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <FiPlus /> Add Work
                    </button>
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : works.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🎨</div>
                        <h3>No works yet</h3>
                        <p>Add portfolio items to showcase your collaborations</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {works.map(work => (
                            <div key={work.id} className="work-card fade-in">
                                {work.image_url ? (
                                    <img src={work.image_url} alt={work.title} className="work-card-image" />
                                ) : (
                                    <div className="work-card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: 'var(--bg-input)' }}>
                                        🎨
                                    </div>
                                )}
                                <div className="work-card-body">
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                        {work.category && <span className="badge badge-category">{work.category}</span>}
                                        {work.is_featured && <span className="badge badge-accepted">Featured</span>}
                                    </div>
                                    <h3 className="work-card-title">{work.title}</h3>
                                    <p className="work-card-description">{work.description}</p>
                                    <div style={{ marginTop: 16 }}>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(work.id)}>
                                            <FiTrash2 /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Work Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Add New Work</h2>
                                <button className="modal-close" onClick={() => setShowModal(false)}>
                                    <FiX />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Title *</label>
                                    <input className="form-input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Work title" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe this work" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image URL</label>
                                    <input className="form-input" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <input className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Social Media, Video" />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
                                        <span className="form-label" style={{ marginBottom: 0 }}>Featured on homepage</span>
                                    </label>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add Work</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        </DashboardLayout>
    );
}
