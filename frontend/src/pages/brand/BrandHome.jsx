import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FiSend, FiClock, FiCheckCircle, FiXCircle, FiUsers, FiArrowRight, FiSearch } from 'react-icons/fi';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import DashboardLayout from '../../components/DashboardLayout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function BrandHome() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        API.get('/brand/requests')
            .then(res => {
                const reqs = res.data || [];
                setRequests(reqs);
                setStats({
                    total: reqs.length,
                    pending: reqs.filter(r => r.status === 'pending').length,
                    accepted: reqs.filter(r => r.status === 'accepted').length,
                    rejected: reqs.filter(r => r.status === 'rejected').length,
                });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = requests
        .filter(r => filter === 'all' || r.status === filter)
        .filter(r => !searchQuery || r.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || r.message?.toLowerCase().includes(searchQuery.toLowerCase()));

    const doughnutData = {
        labels: ['Accepted', 'Pending', 'Rejected'],
        datasets: [{
            data: [stats.accepted, stats.pending, stats.rejected],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0,
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { position: 'bottom', labels: { color: 'var(--text-secondary)' } } },
        cutout: '70%',
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#d97706', label: 'Pending' },
            accepted: { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', label: 'Confirmed' },
            rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', label: 'Declined' }
        };
        const s = styles[status] || { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)', label: status };
        return (
            <span style={{ padding: '4px 12px', background: s.bg, color: s.color, borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                {s.label}
            </span>
        );
    };

    return (
        <DashboardLayout role="brand">
            <div className="page-header" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 className="page-title">Welcome back, {user?.name || 'Brand Partner'}</h1>
                    <p className="page-subtitle">Here is your campaign overview</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <a href="/brand/creators" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
                        Browse Talent Pool <FiArrowRight />
                    </a>
                </div>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : (
                <>
                    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                        <div className="stat-card fade-in" style={{ padding: '24px', animationDelay: '0s' }}>
                            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><FiSend /></div>
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Requests</div>
                        </div>
                        <div className="stat-card fade-in" style={{ padding: '24px', animationDelay: '0.1s' }}>
                            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><FiClock /></div>
                            <div className="stat-value">{stats.pending}</div>
                            <div className="stat-label">Pending Responses</div>
                        </div>
                        <div className="stat-card fade-in" style={{ padding: '24px', animationDelay: '0.2s' }}>
                            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><FiCheckCircle /></div>
                            <div className="stat-value">{stats.accepted}</div>
                            <div className="stat-label">Confirmed Bookings</div>
                        </div>
                        <div className="stat-card fade-in" style={{ padding: '24px', animationDelay: '0.3s' }}>
                            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><FiXCircle /></div>
                            <div className="stat-value">{stats.rejected}</div>
                            <div className="stat-label">Declined Requests</div>
                        </div>
                    </div>

                    <div className="two-col-grid" style={{ marginTop: '24px', gap: '24px', gridTemplateColumns: '1fr 2fr' }}>
                        <div className="card fade-in" style={{ padding: '24px', animationDelay: '0.4s' }}>
                            <h3 style={{ marginBottom: '24px', fontWeight: 700, fontSize: '1.1rem' }}>Booking Breakdown</h3>
                            <div style={{ height: '240px', display: 'flex', justifyContent: 'center' }}>
                                <Doughnut data={doughnutData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="card fade-in" style={{ padding: '24px', animationDelay: '0.5s', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Recent Activity</h3>
                                
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ position: 'relative' }}>
                                        <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={14} />
                                        <input
                                            type="text"
                                            placeholder="Search creator..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            style={{ padding: '8px 12px 8px 34px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-secondary)', fontSize: '0.85rem', width: '200px', color: 'var(--text-primary)' }}
                                        />
                                    </div>
                                    <select 
                                        value={filter} 
                                        onChange={e => setFilter(e.target.value)}
                                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', cursor: 'pointer' }}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            {filtered.length === 0 ? (
                                <div className="empty-state" style={{ flex: 1, padding: '40px 20px' }}>
                                    <div className="icon"><FiUsers size={40} style={{ color: 'var(--border-disabled, #ccc)' }} /></div>
                                    <h3 style={{ marginTop: '16px' }}>No campaigns found</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You haven't initiated any creator collaborations matching this filter.</p>
                                    <a href="/brand/creators" className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>Start Exploring</a>
                                </div>
                            ) : (
                                <div style={{ margin: '0 -24px -24px -24px', overflowX: 'auto' }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th style={{ paddingLeft: '24px' }}>Creator</th>
                                                <th>Campaign Message</th>
                                                <th>Date Sent</th>
                                                <th style={{ paddingRight: '24px', textAlign: 'right' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.slice(0, 5).map(req => (
                                                <tr key={req.id}>
                                                    <td style={{ paddingLeft: '24px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                                                                {req.creator?.name?.charAt(0) || 'C'}
                                                            </div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{req.creator?.name || 'Creator'}</div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                            {req.message}
                                                        </div>
                                                    </td>
                                                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        {new Date(req.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ paddingRight: '24px', textAlign: 'right' }}>
                                                        {getStatusBadge(req.status)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            
                            {filtered.length > 5 && (
                                <div style={{ borderTop: '1px solid var(--border)', margin: '0 -24px -24px -24px', padding: '16px', textAlign: 'center' }}>
                                    <a href="/brand/requests" style={{ color: 'var(--info)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>View All History</a>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
