import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FiCalendar, FiClock, FiCheckCircle, FiEye, FiTrendingUp, FiStar } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout';

export default function CreatorHome() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBookings: 0, pending: 0, confirmed: 0, profileViews: 0, avgRating: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            API.get('/creator/requests'),
            API.get('/creator/profile')
        ]).then(([reqRes, profRes]) => {
            const requests = reqRes.data || [];
            const prof = profRes.data || null;

            setStats({
                totalBookings: requests.length,
                pending: requests.filter(r => r.status === 'pending').length,
                confirmed: requests.filter(r => r.status === 'accepted').length,
                profileViews: prof?.followers ? Math.floor(prof.followers * 0.08) : 0, 
                avgRating: 4.8
            });
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout role="creator">
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's what's happening.</p>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : (
                <>
                    {/* Top 4 Cards matching video exactly */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                        {/* Total Bookings */}
                        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '140px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                                <span>Total Bookings</span>
                                <FiCalendar style={{ color: '#8b5cf6' }} size={16} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>{stats.totalBookings}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All time</div>
                            </div>
                        </div>

                        {/* Pending */}
                        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '140px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                                <span>Pending</span>
                                <FiClock style={{ color: '#f59e0b' }} size={16} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>{stats.pending}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting response</div>
                            </div>
                        </div>

                        {/* Confirmed */}
                        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '140px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                                <span>Confirmed</span>
                                <FiCheckCircle style={{ color: '#10b981' }} size={16} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>{stats.confirmed}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active collaborations</div>
                            </div>
                        </div>

                        {/* Profile Views */}
                        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '140px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                                <span>Profile Views</span>
                                <FiEye style={{ color: '#3b82f6' }} size={16} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>{stats.profileViews.toLocaleString()}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total impressions</div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Earnings & Recent Booking Requests */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px' }}>
                        {/* Earnings Card */}
                        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Earnings</h3>
                                <FiTrendingUp style={{ color: '#10b981' }} size={18} />
                            </div>
                            
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Released</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>$0.00</div>
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Average Rating</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', gap: '4px', color: '#f59e0b' }}>
                                        {[1,2,3,4,5].map(s => <FiStar key={s} fill="#f59e0b" size={16} />)}
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>5 / 5</span>
                                </div>
                            </div>

                            <button style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                                View Payout History
                            </button>
                        </div>

                        {/* Recent Booking Requests */}
                        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Booking Requests</h3>
                                <a href="/creator/requests" style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 600, textDecoration: 'none' }}>View All</a>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>N</div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Nike Campaign</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sports Brand</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span style={{ padding: '4px 12px', background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>Pending</span>
                                        <button style={{ padding: '6px 16px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>View Details</button>
                                    </div>
                                </div>

                                <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>Z</div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Zara Fall Collection</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fashion</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>Confirmed</span>
                                        <button style={{ padding: '6px 16px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Manage Booking</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
