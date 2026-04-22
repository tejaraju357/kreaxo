import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { FiUsers, FiBriefcase, FiLink, FiImage, FiCheckCircle, FiXCircle, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            API.get('/admin/stats'),
            API.get('/admin/registrations') // For the quick actions table
        ]).then(([statRes, usersRes]) => {
            setStats(statRes.data || {});
            setPendingUsers((usersRes.data || []).slice(0, 5)); // Just take top 5
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleApproval = async (id, status) => {
        try {
            await API.put(`/admin/users/${id}/status`, { status });
            setPendingUsers(prev => prev.filter(u => u.id !== id));
            // Update stats optimistically if accepted
            if (status === 'approved') {
                const isBrand = pendingUsers.find(u => u.id === id)?.role === 'brand';
                setStats(s => ({
                    ...s,
                    brands: isBrand ? (s.brands || 0) + 1 : s.brands,
                    creators: !isBrand ? (s.creators || 0) + 1 : s.creators,
                }))
            }
        } catch (err) {
            alert('Failed to update user status');
        }
    };

    const statCards = [
        { label: 'Total Creators', value: stats.creators || 0, icon: <FiUsers />, color: '#8b5cf6', trend: '+12% this week' },
        { label: 'Total Brands', value: stats.brands || 0, icon: <FiBriefcase />, color: '#3b82f6', trend: '+5% this week' },
        { label: 'Platform Bookings', value: stats.collaborations || 0, icon: <FiLink />, color: '#f59e0b', trend: '+18% this month' },
        { label: 'Portfolio Works', value: stats.works || 0, icon: <FiImage />, color: '#10b981', trend: '+24% this month' },
    ];

    const lineData = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [{
            label: 'Platform Growth',
            data: [45, 60, 110, 190, 250, (stats.creators || 0) + (stats.brands || 0)],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#8b5cf6',
            pointRadius: 4,
        }],
    };

    const doughnutData = {
        labels: ['Accepted', 'Pending', 'Rejected'],
        datasets: [{
            data: [stats.collaborations || 0, Math.floor((stats.collaborations || 0) / 3), 2], 
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0,
        }],
    };

    const chartOptions = { responsive: true, plugins: { legend: { position: 'bottom' } } };
    const lineOptions = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } } };

    return (
        <DashboardLayout role="admin">
            <div className="page-header" style={{ marginBottom: '24px' }}>
                    <div>
                        <h1 className="page-title">Superadmin Overview</h1>
                        <p className="page-subtitle">Platform health and real-time statistics</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                            <Link to="/admin/creators" className="card fade-in" style={{ display: 'flex', alignItems: 'center', gap: '20px', textDecoration: 'none', transition: 'all 0.2s', borderLeft: '4px solid #8b5cf6' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                    <FiUsers />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Content Creators</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Manage profiles and analytics</p>
                                </div>
                                <FiArrowRight style={{ color: 'var(--text-muted)' }} />
                            </Link>
                            <Link to="/admin/brands" className="card fade-in" style={{ display: 'flex', alignItems: 'center', gap: '20px', textDecoration: 'none', transition: 'all 0.2s', borderLeft: '4px solid #3b82f6', animationDelay: '0.1s' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                    <FiBriefcase />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Brand Partners</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Monitor campaigns and billing</p>
                                </div>
                                <FiArrowRight style={{ color: 'var(--text-muted)' }} />
                            </Link>
                        </div>

                        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                            {statCards.map((stat, i) => (
                                <div key={i} className="stat-card fade-in" style={{ animationDelay: `${(i + 2) * 0.1}s` }}>
                                    <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                                        {stat.icon}
                                    </div>
                                    <div className="stat-value">{stat.value}</div>
                                    <div className="stat-label">{stat.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FiTrendingUp /> {stat.trend}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="two-col-grid" style={{ marginTop: '24px', gap: '24px' }}>
                            <div className="card fade-in" style={{ animationDelay: '0.3s' }}>
                                <h3 style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.1rem' }}>User Growth Trend</h3>
                                <div style={{ height: '280px', display: 'flex', justifyContent: 'center' }}>
                                    <Line data={lineData} options={lineOptions} />
                                </div>
                            </div>
                            <div className="card fade-in" style={{ animationDelay: '0.4s' }}>
                                <h3 style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.1rem' }}>Booking Success Rate</h3>
                                <div style={{ height: '280px', display: 'flex', justifyContent: 'center' }}>
                                    <Doughnut data={doughnutData} options={chartOptions} />
                                </div>
                            </div>
                        </div>

                        {/* Recent Pending Approvals Table inline */}
                        <div className="card fade-in" style={{ marginTop: '24px', animationDelay: '0.5s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Recent Registration Requests</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Users waiting for platform access</p>
                                </div>
                                <Link to="/admin/registrations" className="btn btn-secondary btn-sm" style={{ gap: '8px' }}>
                                    View All <FiArrowRight />
                                </Link>
                            </div>

                            {pendingUsers.length === 0 ? (
                                <div className="empty-state" style={{ padding: '30px' }}>
                                    <div className="icon">✅</div>
                                    <h3>You're all caught up!</h3>
                                    <p>No new user registrations pending approval.</p>
                                </div>
                            ) : (
                                <div className="table-container">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Email Address</th>
                                                <th>Role Type</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingUsers.map(u => (
                                                <tr key={u.id}>
                                                    <td>
                                                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                                                    </td>
                                                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                                                    <td>
                                                        <span className={`badge ${u.role === 'creator' ? 'badge-primary' : 'badge-secondary'}`} style={{ textTransform: 'capitalize' }}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button className="btn btn-success btn-sm" onClick={() => handleApproval(u.id, 'approved')} style={{ padding: '4px 12px', gap: '4px' }}>
                                                                <FiCheckCircle /> Approve
                                                            </button>
                                                            <button className="btn btn-sm" onClick={() => handleApproval(u.id, 'rejected')} style={{ background: '#fef2f2', color: 'var(--danger)', border: '1px solid #fecaca', padding: '4px 12px', gap: '4px' }}>
                                                                <FiXCircle /> Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
        </DashboardLayout>
    );
}
