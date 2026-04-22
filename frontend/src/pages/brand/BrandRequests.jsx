import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { FiClock, FiCheckCircle, FiXCircle, FiFilter, FiSearch, FiSend, FiLink } from 'react-icons/fi';

export default function BrandRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        API.get('/brand/requests')
            .then(res => setRequests(res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const getStatusBadge = (status) => {
        const map = {
            pending: { cls: 'badge-pending', icon: <FiClock size={11} />, label: 'Pending Response' },
            accepted: { cls: 'badge-accepted', icon: <FiCheckCircle size={11} />, label: 'Accepted by Creator' },
            rejected: { cls: 'badge-rejected', icon: <FiXCircle size={11} />, label: 'Declined' },
        };
        const s = map[status] || { cls: '', icon: null, label: status };
        return (
            <span className={`badge ${s.cls}`} style={{ display: 'inline-flex', gap: '5px', alignItems: 'center', padding: '6px 14px', borderRadius: '8px', fontWeight: 600 }}>
                {s.icon} {s.label}
            </span>
        );
    };

    const filtered = requests
        .filter(r => filter === 'all' || r.status === filter)
        .filter(r => !searchQuery || r.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || r.message?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <DashboardLayout role="brand">
            <div className="page-header" style={{ marginBottom: '24px' }}>
                    <div>
                        <h1 className="page-title">My Bookings & Proposals</h1>
                        <p className="page-subtitle">Track the status of your collaborations</p>
                    </div>
                </div>

                <div className="card fade-in" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '250px', maxWidth: '400px' }}>
                            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} size={15} />
                            <input
                                type="text"
                                placeholder="Search by creator or message..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{ width: '100%', paddingLeft: '36px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-secondary)', fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <FiFilter size={14} style={{ color: 'var(--text-muted)' }} />
                            {['all', 'pending', 'accepted', 'rejected'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        border: '1px solid var(--border)',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        background: filter === f ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                        color: filter === f ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                        transition: 'all 0.2s',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {f === 'all' ? `All Items` : f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="icon"><FiSend size={48} style={{ color: 'var(--border-disabled, #ccc)' }} /></div>
                            <h3>No {filter === 'all' ? '' : filter} bookings found</h3>
                            <p>Browse creators to send a new proposal</p>
                            <a href="/brand/creators" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex', gap: '8px' }}>
                                Find Creators <FiSearch />
                            </a>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Creator Identity</th>
                                        <th>Collaboration Details</th>
                                        <th>Current Status</th>
                                        <th>Sent On</th>
                                        <th>Action Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(req => (
                                        <tr key={req.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0 }}>
                                                        {req.creator?.name?.charAt(0) || 'C'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{req.creator?.name || 'Creator'}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.creator?.category || 'General'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ maxWidth: '350px' }}>
                                                <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, position: 'relative' }}>
                                                    <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'var(--bg-secondary)', padding: '0 8px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Proposal Sent</div>
                                                    {req.message || 'No description provided'}
                                                </div>
                                            </td>
                                            <td>{getStatusBadge(req.status)}</td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                                                {new Date(req.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td>
                                                {req.status === 'accepted' ? (
                                                    <button className="btn btn-primary btn-sm" style={{ gap: '6px', whiteSpace: 'nowrap' }}>
                                                        View Next Steps <FiLink size={14} />
                                                    </button>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Waiting on Creator</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
        </DashboardLayout>
    );
}
