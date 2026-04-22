import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { FiSearch, FiInstagram, FiYoutube, FiSend, FiX, FiUsers, FiFilter } from 'react-icons/fi';

const CATEGORIES = ['All', 'Fashion', 'Tech', 'Lifestyle', 'Food', 'Travel', 'Fitness', 'Beauty', 'Gaming', 'Photography'];

export default function BrowseCreators() {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestModal, setRequestModal] = useState({ isOpen: false, creator: null });
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [successId, setSuccessId] = useState(null);

    useEffect(() => { fetchCreators(); }, []);

    const fetchCreators = () => {
        setLoading(true);
        API.get('/brand/creators')
            .then(res => setCreators(res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    const handleSendRequest = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await API.post('/brand/request', {
                creator_id: requestModal.creator.id,
                message
            });
            setSuccessId(requestModal.creator.id);
            setRequestModal({ isOpen: false, creator: null });
            setMessage('');
            setTimeout(() => setSuccessId(null), 3000);
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to send request');
        } finally {
            setSending(false);
        }
    };

    const filtered = creators.filter(c => {
        const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.bio?.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'All' || c.category?.toLowerCase() === category.toLowerCase();
        return matchSearch && matchCat;
    });

    return (
        <DashboardLayout role="brand">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Browse Creators</h1>
                    <p className="page-subtitle">{creators.length} creators available for collaboration</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={15} />
                            <input
                                type="text"
                                placeholder="Search creators by name or bio..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ width: '100%', paddingLeft: '36px', padding: '10px 12px 10px 36px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-secondary)', fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none' }}
                                id="creator-search"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <FiFilter size={14} style={{ color: 'var(--text-muted)' }} />
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    id={`cat-filter-${cat.toLowerCase()}`}
                                    style={{
                                        padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border)', cursor: 'pointer',
                                        fontWeight: 600, fontSize: '0.78rem', background: category === cat ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                        color: category === cat ? 'var(--bg-primary)' : 'var(--text-secondary)', transition: 'all 0.2s'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Success toast */}
                {successId && (
                    <div style={{ marginBottom: '16px', padding: '12px 20px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ✅ Request sent successfully!
                    </div>
                )}

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state card">
                        <div className="icon">👥</div>
                        <h3>No creators found</h3>
                        <p>Try adjusting your search or category filter</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {filtered.map(creator => (
                            <div key={creator.id} className="profile-card fade-in">
                                <div className="profile-avatar" style={{ margin: '0 auto 16px', position: 'relative' }}>
                                    {creator.profile_image ? (
                                        <img src={creator.profile_image} alt={creator.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.8rem', fontWeight: 800, margin: '0 auto' }}>
                                            {creator.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                    )}
                                    {creator.is_public && (
                                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', borderRadius: '50%', background: '#10b981', border: '2px solid var(--bg-card)' }}></div>
                                    )}
                                </div>

                                <h3 className="profile-name" style={{ textAlign: 'center', marginBottom: '4px' }}>{creator.name}</h3>

                                {creator.category && (
                                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                                        <span className="badge badge-category">{creator.category}</span>
                                    </div>
                                )}

                                {creator.bio && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '16px', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {creator.bio}
                                    </p>
                                )}

                                {/* Stats */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                                            {creator.followers > 1000 ? (creator.followers / 1000).toFixed(1) + 'K' : creator.followers || '0'}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Followers</div>
                                    </div>
                                    {creator.posts > 0 && (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{creator.posts}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Posts</div>
                                        </div>
                                    )}
                                </div>

                                {/* Social links */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                                    {creator.instagram && (
                                        <a href={`https://instagram.com/${creator.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                                            style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899', textDecoration: 'none' }}>
                                            <FiInstagram size={15} />
                                        </a>
                                    )}
                                    {creator.youtube && (
                                        <a href={creator.youtube} target="_blank" rel="noopener noreferrer"
                                            style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', textDecoration: 'none' }}>
                                            <FiYoutube size={15} />
                                        </a>
                                    )}
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', gap: '8px' }}
                                    onClick={() => { setRequestModal({ isOpen: true, creator }); setMessage(''); }}
                                    id={`collaborate-${creator.id}`}
                                    disabled={successId === creator.id}
                                >
                                    {successId === creator.id ? '✅ Request Sent' : <><FiSend size={14} /> Collaborate</>}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Request Modal */}
                {requestModal.isOpen && (
                    <div className="modal-overlay" onClick={() => setRequestModal({ isOpen: false, creator: null })}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    Send Request to {requestModal.creator?.name}
                                </h2>
                                <button className="modal-close" onClick={() => setRequestModal({ isOpen: false, creator: null })} id="close-modal">
                                    <FiX />
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '10px', marginBottom: '20px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                                    {requestModal.creator?.name?.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{requestModal.creator?.name}</div>
                                    <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>{requestModal.creator?.category}</div>
                                </div>
                            </div>

                            <form onSubmit={handleSendRequest}>
                                <div className="form-group">
                                    <label className="form-label">Your Proposal / Message *</label>
                                    <textarea
                                        className="form-input"
                                        rows={5}
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder="Describe your collaboration idea, budget, timeline, and what you're looking for..."
                                        required
                                        id="proposal-message"
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setRequestModal({ isOpen: false, creator: null })}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={sending} style={{ gap: '8px' }} id="send-request-submit">
                                        {sending ? <><span className="spinner-sm"></span> Sending...</> : <><FiSend size={14}/> Send Request</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        </DashboardLayout>
    );
}
