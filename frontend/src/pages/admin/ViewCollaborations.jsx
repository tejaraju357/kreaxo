import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';

export default function ViewCollaborations() {
    const [collabs, setCollabs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/admin/collaborations')
            .then(res => setCollabs(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const getStatusBadge = (status) => {
        const classes = {
            pending: 'badge-pending',
            accepted: 'badge-accepted',
            rejected: 'badge-rejected'
        };
        return <span className={`badge ${classes[status] || ''}`}>{status}</span>;
    };

    return (
        <DashboardLayout role="admin">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Collaborations</h1>
                        <p className="page-subtitle">{collabs.length} total requests</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : collabs.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🤝</div>
                        <h3>No collaborations yet</h3>
                        <p>Collaboration requests will appear here</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Brand</th>
                                    <th>Creator</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {collabs.map(collab => (
                                    <tr key={collab.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{collab.brand?.name}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{collab.creator?.name}</div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {collab.message || '—'}
                                        </td>
                                        <td>{getStatusBadge(collab.status)}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            {new Date(collab.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
        </DashboardLayout>
    );
}
