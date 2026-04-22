import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { FiDollarSign, FiTrendingUp, FiArrowUpRight, FiClock, FiCheckCircle } from 'react-icons/fi';

export default function CreatorEarnings() {
    const [stats, setStats] = useState({ total_earned: 0, pending: 0, last_payout: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking for now as backend might not have specific earnings endpoint yet
        // In a real app, API.get('/creator/earnings') would be called
        setTimeout(() => {
            setStats({ total_earned: 1250, pending: 450, last_payout: 800 });
            setTransactions([
                { id: 1, brand: 'Nike', amount: 400, date: '2026-03-10', status: 'completed' },
                { id: 2, brand: 'Zara', amount: 350, date: '2026-03-05', status: 'completed' },
                { id: 3, brand: 'Apple', amount: 500, date: '2026-03-15', status: 'pending' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <DashboardLayout role="creator">
            <div className="page-header" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 className="page-title">Earnings & Payments</h1>
                    <p className="page-subtitle">Track your revenue and payout history</p>
                </div>
                <button className="btn btn-primary">Withdraw Funds</button>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="stat-card fade-in">
                            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}><FiDollarSign /></div>
                            <div className="stat-value">${stats.total_earned.toLocaleString()}</div>
                            <div className="stat-label">Total Revenue</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '8px', fontWeight: 600 }}>
                                <FiTrendingUp /> +15% this month
                            </div>
                        </div>
                        <div className="stat-card fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}><FiClock /></div>
                            <div className="stat-value">${stats.pending.toLocaleString()}</div>
                            <div className="stat-label">Awaiting Payout</div>
                        </div>
                        <div className="stat-card fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)' }}><FiArrowUpRight /></div>
                            <div className="stat-value">${stats.last_payout.toLocaleString()}</div>
                            <div className="stat-label">Last Payout</div>
                        </div>
                    </div>

                    <div className="card fade-in" style={{ animationDelay: '0.3s' }}>
                        <h3 style={{ marginBottom: '20px', fontWeight: 700, fontSize: '1.1rem' }}>Transaction History</h3>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Brand Partner</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => (
                                        <tr key={t.id}>
                                            <td style={{ fontWeight: 600 }}>{t.brand}</td>
                                            <td style={{ fontWeight: 700 }}>${t.amount}</td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{t.date}</td>
                                            <td>
                                                <span className={`badge ${t.status === 'completed' ? 'badge-accepted' : 'badge-pending'}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
