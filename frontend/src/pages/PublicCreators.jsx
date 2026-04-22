import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios';

export default function PublicCreators() {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/public/creators')
            .then(res => setCreators(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page-container">
            <Navbar />
            <section className="section" style={{ paddingTop: 120 }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-tag">Our Team</div>
                        <h1 className="section-title">Content Creators</h1>
                        <p className="section-subtitle">
                            Meet the talented creators in our network
                        </p>
                    </div>

                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : creators.length === 0 ? (
                        <div className="empty-state">
                            <div className="icon">👥</div>
                            <h3>No creators yet</h3>
                            <p>Creators will be showcased here soon</p>
                        </div>
                    ) : (
                        <div className="card-grid">
                            {creators.map(creator => (
                                <div key={creator.id} className="profile-card fade-in">
                                    <div className="profile-avatar">
                                        {creator.profile_image ? (
                                            <img src={creator.profile_image} alt={creator.name} />
                                        ) : (
                                            creator.name?.charAt(0)?.toUpperCase() || 'C'
                                        )}
                                    </div>
                                    <h3 className="profile-name">{creator.name}</h3>
                                    {creator.category && (
                                        <div className="profile-meta">
                                            <span className="badge badge-category">{creator.category}</span>
                                        </div>
                                    )}
                                    {creator.bio && <p className="profile-bio">{creator.bio}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}
