import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { FiCheck, FiX, FiClock } from 'react-icons/fi';

export default function ManageRegistrations() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState(null); // id of user being actioned

    const fetchPendingUsers = () => {
        setLoading(true);
        API.get('/admin/users/pending')
            .then(res => setUsers(res.data))
            .catch(err => console.error("Failed to fetch pending users:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleAction = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this user?`)) return;
        
        setActioning(id);
        try {
            await API.put(`/admin/users/${id}/status`, { status });
            // Remove user from the list
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error(`Failed to ${status} user:`, err);
            alert(`Failed to ${status} user.`);
        } finally {
            setActioning(null);
        }
    };

    return (
        <DashboardLayout role="admin">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Pending Registrations</h1>
                        <p className="page-subtitle">Approve or reject new content creators and brands</p>
                    </div>
                    <div className="stats-badge" style={{ background: 'var(--accent-gradient)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                        {users.length} Pending
                    </div>
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : users.length === 0 ? (
                    <div className="empty-state card">
                        <div className="icon">🟢</div>
                        <h3>All caught up!</h3>
                        <p>There are no pending registrations waiting for your approval.</p>
                    </div>
                ) : (
                    <div className="table-container fade-in">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Date Registered</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td style={{ fontWeight: 600 }}>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'creator' ? 'badge-primary' : 'badge-secondary'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="text-right d-flex" style={{ gap: 8, justifyContent: 'flex-end' }}>
                                            <button 
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleAction(user.id, 'approved')}
                                                disabled={actioning === user.id}
                                                style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                                            >
                                                <FiCheck /> Approve
                                            </button>
                                            <button 
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleAction(user.id, 'rejected')}
                                                disabled={actioning === user.id}
                                                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                            >
                                                <FiX /> Reject
                                            </button>
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
