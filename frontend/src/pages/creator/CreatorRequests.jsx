import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { FiClock, FiCheckCircle, FiXCircle, FiFilter, FiSearch, FiMessageSquare } from 'react-icons/fi';

export default function CreatorRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        API.get('/creator/requests')
            .then(res => setRequests(res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleAction = async (id, status) => {
        try {
            await API.put(`/creator/requests/${id}`, { status });
            setRequests(requests.map(req => 
                req.id === id ? { ...req, status } : req
            ));
        } catch (err) {
            alert('Failed to update request');
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            pending: { cls: 'badge-pending', icon: <FiClock size={11} />, label: 'Pending' },
            accepted: { cls: 'badge-accepted', icon: <FiCheckCircle size={11} />, label: 'Accepted' },
            rejected: { cls: 'badge-rejected', icon: <FiXCircle size={11} />, label: 'Rejected' },
        };
        const s = map[status] || { cls: '', icon: null, label: status };
        return (
            <span className={`badge ${s.cls}`} style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                {s.icon} {s.label}
            </span>
        );
    };

    const filtered = requests
        .filter(r => filter === 'all' || r.status === filter)
        .filter(r => !searchQuery || r.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || r.message?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <DashboardLayout role="creator">
            <div className="page-header" style={{ marginBottom: '24px' }}>
                    <div>
                        <h1 className="page-title">Proposals</h1>
                        <p className="page-subtitle">Manage collaboration requests from brands</p>
                    </div>
                </div>

                <div className="card fade-in" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '250px', maxWidth: '400px' }}>
                            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} size={15} />
                            <input
                                type="text"
                                placeholder="Search by brand name or message..."
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
                                    {f === 'all' ? `All Proposals` : f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="icon"><FiMessageSquare size={48} style={{ color: 'var(--border-disabled, #ccc)' }} /></div>
                            <h3>No {filter === 'all' ? '' : filter} proposals found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Brand Details</th>
                                        <th>Proposal Content</th>
                                        <th>Status</th>
                                        <th>Received On</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(req => (
                                        <tr key={req.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                                                        {req.brand?.name?.charAt(0) || 'B'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{req.brand?.name || 'Unknown Brand'}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.brand?.industry || 'Industry'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ maxWidth: '350px' }}>
                                                <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                    "{req.message || 'No description provided'}"
                                                </div>
                                            </td>
                                            <td>{getStatusBadge(req.status)}</td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                                                {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td>
                                                {req.status === 'pending' ? (
                                                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleAction(req.id, 'accepted')}
                                                            style={{ gap: '6px', width: '100%', justifyContent: 'center' }}
                                                        >
                                                            <FiCheckCircle size={14} /> Accept
                                                        </button>
                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() => handleAction(req.id, 'rejected')}
                                                            style={{ background: '#fef2f2', color: 'var(--danger)', border: '1px solid #fecaca', gap: '6px', width: '100%', justifyContent: 'center' }}
                                                        >
                                                            <FiXCircle size={14} /> Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Resolved</span>
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
