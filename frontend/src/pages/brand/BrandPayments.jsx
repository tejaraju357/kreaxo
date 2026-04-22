import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { FiCreditCard, FiClock, FiPlus, FiArrowDownRight } from 'react-icons/fi';

export default function BrandPayments() {
    const [stats, setStats] = useState({ total_spent: 0, active_escrow: 0, cards_linked: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setStats({ total_spent: 5400, active_escrow: 1200, cards_linked: 1 });
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <DashboardLayout role="brand">
            <div className="page-header" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 className="page-title">Billing & Payments</h1>
                    <p className="page-subtitle">Manage your payment methods and campaign spending</p>
                </div>
                <button className="btn btn-primary"><FiPlus /> Add Payment Method</button>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="stat-card fade-in">
                            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)' }}><FiArrowDownRight /></div>
                            <div className="stat-value">${stats.total_spent.toLocaleString()}</div>
                            <div className="stat-label">Total Spent</div>
                        </div>
                        <div className="stat-card fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}><FiClock /></div>
                            <div className="stat-value">${stats.active_escrow.toLocaleString()}</div>
                            <div className="stat-label">In Escrow / Pending</div>
                        </div>
                        <div className="stat-card fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-primary)' }}><FiCreditCard /></div>
                            <div className="stat-value">{stats.cards_linked}</div>
                            <div className="stat-label">Linked Cards</div>
                        </div>
                    </div>

                    <div className="card fade-in" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <div style={{ width: '64px', height: '40px', background: '#2563eb', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.7rem' }}>VISA</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>Visa ending in 4242</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Expires 12/28 • Default Payment Method</div>
                            </div>
                            <button className="btn btn-secondary btn-sm">Manage</button>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
