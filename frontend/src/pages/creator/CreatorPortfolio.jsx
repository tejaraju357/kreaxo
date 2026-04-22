import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { FiUpload, FiImage, FiMessageCircle, FiTrash2 } from 'react-icons/fi';

const DUMMY_WORKS = [
    { id: 1, title: 'Summer Campaign', type: 'Reel', image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=400&auto=format&fit=crop', date: 'Mar 2026' },
    { id: 2, title: 'Tech Unboxing', type: 'YouTube Video', image: 'https://images.unsplash.com/photo-1526315265448-f9d9a1ac98aa?q=80&w=400&auto=format&fit=crop', date: 'Feb 2026' },
    { id: 3, title: 'Fashion Series', type: 'Carousel', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop', date: 'Jan 2026' },
];

export default function CreatorPortfolio() {
    const { user } = useAuth();
    const [works, setWorks] = useState(DUMMY_WORKS);

    return (
        <DashboardLayout role="creator">
                <div className="page-header" style={{ marginBottom: '24px' }}>
                    <div>
                        <h1 className="page-title">Portfolio</h1>
                        <p className="page-subtitle">Manage your past works and showcase them to brands.</p>
                    </div>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiUpload /> Add New Work
                    </button>
                </div>

                {works.length === 0 ? (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border)', background: 'transparent' }}>
                        <div style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            <FiImage />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Your portfolio is empty</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Upload your best photos and videos to stand out.</p>
                        <button className="btn" style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 600 }}>
                            Upload First Item
                        </button>
                    </div>
                ) : (
                    <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                        {works.map((work) => (
                            <div key={work.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                                <img src={work.image} alt={work.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                <div style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{work.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{work.type} • {work.date}</p>
                                        </div>
                                        <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => setWorks(works.filter(w => w.id !== work.id))}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Placeholder for Add Block */}
                        <div style={{ background: '#fafafa', borderRadius: '16px', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', cursor: 'pointer' }}>
                            <div style={{ fontSize: '2rem', color: 'var(--text-muted)' }}><FiUpload /></div>
                            <div style={{ marginTop: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Upload Asset</div>
                        </div>
                    </div>
                )}

        </DashboardLayout>
    );
}
