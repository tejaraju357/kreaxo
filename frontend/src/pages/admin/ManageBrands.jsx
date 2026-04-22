import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

export default function ManageBrands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        email: '', password: '', name: '', description: '',
        industry: '', website: '', logo: ''
    });

    const fetchBrands = () => {
        API.get('/admin/brands')
            .then(res => setBrands(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchBrands(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/brands', form);
            setShowModal(false);
            setForm({ email: '', password: '', name: '', description: '', industry: '', website: '', logo: '' });
            fetchBrands();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create brand');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this brand?')) return;
        try {
            await API.delete(`/admin/brands/${id}`);
            fetchBrands();
        } catch (err) {
            alert('Failed to delete brand');
        }
    };

    return (
        <DashboardLayout role="admin">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Manage Brands</h1>
                        <p className="page-subtitle">{brands.length} brands registered</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <FiPlus /> Add Brand
                    </button>
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : brands.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🏢</div>
                        <h3>No brands yet</h3>
                        <p>Add your first brand to get started</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {brands.map(brand => (
                            <div key={brand.id} className="profile-card fade-in">
                                <div className="profile-avatar">
                                    {brand.logo ? (
                                        <img src={brand.logo} alt={brand.name} />
                                    ) : (
                                        brand.name?.charAt(0)?.toUpperCase()
                                    )}
                                </div>
                                <h3 className="profile-name">{brand.name}</h3>
                                <div className="profile-meta">
                                    {brand.industry && <span className="badge badge-category">{brand.industry}</span>}
                                </div>
                                {brand.description && <p className="profile-bio">{brand.description}</p>}
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                                    {brand.user?.email}
                                </div>
                                <div className="profile-actions">
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(brand.id)}>
                                        <FiTrash2 /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Brand Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Add New Brand</h2>
                                <button className="modal-close" onClick={() => setShowModal(false)}>
                                    <FiX />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="two-col-grid">
                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="brand@email.com" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Password *</label>
                                        <input className="form-input" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Brand Name *</label>
                                    <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Brand name" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="About the brand" />
                                </div>
                                <div className="two-col-grid">
                                    <div className="form-group">
                                        <label className="form-label">Industry</label>
                                        <input className="form-input" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} placeholder="e.g. Fashion, Tech" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Website</label>
                                        <input className="form-input" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Logo URL</label>
                                    <input className="form-input" value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} placeholder="https://..." />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add Brand</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        </DashboardLayout>
    );
}
