import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios';
import { FiSearch, FiInstagram, FiYoutube } from 'react-icons/fi';

export default function ServicesPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);

    // Map URL slug -> filter label
    const slugToLabel = {
        'photographer': 'Photographer',
        'photographers': 'Photographer',
        'videographer': 'Videographer',
        'videographers': 'Videographer',
        'ugc': 'UGC',
        'smm': 'SMM',
        'editor': 'Editor',
        'editors': 'Editor',
        'influencer': 'Influencer',
    };
    const initialFilter = category ? (slugToLabel[category.toLowerCase()] || 'All') : 'All';

    const [activeFilter, setActiveFilter] = useState(initialFilter);
    const [searchQuery, setSearchQuery] = useState('');

    // Update filter when URL param changes
    useEffect(() => {
        const label = category ? (slugToLabel[category.toLowerCase()] || 'All') : 'All';
        setActiveFilter(label);
    }, [category]);

    useEffect(() => {
        API.get('/public/creators')
            .then(res => setCreators(Array.isArray(res.data) ? res.data : []))
            .catch(() => { setCreators([]); })
            .finally(() => setLoading(false));
    }, []);

    const filters = [
        { label: 'All', icon: '', slug: 'all' },
        { label: 'Photographer', icon: '📸', slug: 'photographer' },
        { label: 'Videographer', icon: '🎥', slug: 'videographer' },
        { label: 'SMM', icon: '📱', slug: 'smm' },
        { label: 'Editor', icon: '✂️', slug: 'editor' },
        { label: 'UGC', icon: '🚀', slug: 'ugc' },
        { label: 'Influencer', icon: '⚡', slug: 'influencer' }
    ];

    // Filter Creators
    const filteredCreators = creators.filter(c => {
        let matchesFilter = true;
        if (activeFilter !== 'All') {
            matchesFilter = (c.category || '').toLowerCase().includes(activeFilter.toLowerCase());
        }
        
        let matchesSearch = true;
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            matchesSearch = (c.name || '').toLowerCase().includes(q) || 
                            (c.bio || '').toLowerCase().includes(q) ||
                            (c.category || '').toLowerCase().includes(q);
        }
        
        return matchesFilter && matchesSearch;
    });

    const formatCount = (count) => {
        if (!count || isNaN(count)) return '0';
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
        return count.toString();
    };

    return (
        <div className="page-container" style={{ background: 'var(--bg-primary)' }}>
            <style>{`
                .creator-grid-card:hover {
                    transform: translateY(-8px) !important;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.06) !important;
                }
                .creator-grid-card {
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
            `}</style>
            <Navbar />
            <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px', maxWidth: '1400px' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '80px', marginTop: '60px' }}>
                    <h2 style={{ fontSize: '0.9rem', color: '#a11d80ff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '24px' }}>
                        DISCOVER ELITE TALENT
                    </h2>
                    <h1 style={{ fontSize: '5rem', fontFamily: 'var(--font-serif)', color: '#0F131D', letterSpacing: '-1px', textTransform: 'uppercase', lineHeight: 0.9 }}>
                        OUR CREATORS
                    </h1>
                </div>

                {/* Filter and Search Bar */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '60px',
                    gap: '40px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {filters.map((f) => (
                            <button
                                key={f.label}
                                onClick={() => {
                                    if (f.slug === 'all') navigate('/services');
                                    else navigate(`/services/${f.slug}`);
                                }}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '50px',
                                    border: '1px solid',
                                    borderColor: activeFilter === f.label ? '#a11d80ff' : '#E5E7EB',
                                    background: activeFilter === f.label ? '#a11d80ff' : '#FFF',
                                    color: activeFilter === f.label ? '#FFF' : '#4B5563',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: 'relative', flex: '1', maxWidth: '350px' }}>
                        <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 44px',
                                borderRadius: '50px',
                                border: '1px solid #E5E7EB',
                                outline: 'none',
                                fontSize: '0.9rem',
                                color: '#0F131D'
                            }}
                        />
                    </div>
                </div>

                {/* Creators 3-4 Column Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}><div className="spinner"></div></div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                        gap: '30px' 
                    }}>
                        {filteredCreators.length > 0 ? (
                            filteredCreators.map((creator) => {
                                const hasInsta = creator.insta_followers > 0 || creator.insta_posts > 0;
                                const hasYoutube = creator.youtube_subscribers > 0 || creator.youtube_videos > 0;

                                return (
                                    <Link to={`/profile/${creator.id}`} key={creator.id} style={{
                                        textDecoration: 'none',
                                        background: '#FFF',
                                        borderRadius: '32px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: '1px solid #F3F4F6',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.02)'
                                    }} className="creator-grid-card">
                                        {/* Profile Photo Area */}
                                        <div style={{ width: '100%', height: '320px', position: 'relative', overflow: 'hidden' }}>
                                            <img 
                                                src={creator.profile_image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800`} 
                                                alt={creator.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div style={{ 
                                                position: 'absolute', 
                                                bottom: '16px', 
                                                left: '16px', 
                                                background: 'rgba(255,255,255,0.95)', 
                                                padding: '6px 16px', 
                                                borderRadius: '50px',
                                                fontSize: '0.65rem',
                                                fontWeight: 900,
                                                letterSpacing: '1px',
                                                color: '#0F131D'
                                            }}>
                                                {creator.category?.toUpperCase() || 'CREATOR'}
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div style={{ padding: '24px' }}>
                                            <h3 style={{ 
                                                fontSize: '1.6rem', 
                                                fontFamily: 'var(--font-serif)', 
                                                color: '#0F131D', 
                                                marginBottom: '20px',
                                                lineHeight: 1.2
                                            }}>
                                                {creator.name}
                                            </h3>

                                            {/* Multi-Platform Metrics - Conditional Grid */}
                                            {(hasInsta || hasYoutube) && (
                                                <div style={{ 
                                                    display: 'grid', 
                                                    gridTemplateColumns: (hasInsta && hasYoutube) ? '1fr 1fr' : '1fr', 
                                                    gap: '12px', 
                                                    borderTop: '1px solid #F3F4F6', 
                                                    paddingTop: '20px' 
                                                }}>
                                                    {/* Insta Column */}
                                                    {hasInsta && (
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                                                <FiInstagram /> INSTAGRAM
                                                            </div>
                                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F131D' }}>
                                                                {formatCount(creator.insta_followers)} <span style={{ fontSize: '0.65rem', fontWeight: 400, color: '#9CA3AF' }}>Followers</span>
                                                            </div>
                                                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', marginTop: '2px' }}>
                                                                {formatCount(creator.insta_posts)} <span style={{ fontSize: '0.65rem', fontWeight: 400, color: '#9CA3AF' }}>Posts</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Youtube Column */}
                                                    {hasYoutube && (
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                                                <FiYoutube /> YOUTUBE
                                                            </div>
                                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F131D' }}>
                                                                {formatCount(creator.youtube_subscribers)} <span style={{ fontSize: '0.65rem', fontWeight: 400, color: '#9CA3AF' }}>Subs</span>
                                                            </div>
                                                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', marginTop: '2px' }}>
                                                                {formatCount(creator.youtube_videos)} <span style={{ fontSize: '0.65rem', fontWeight: 400, color: '#9CA3AF' }}>Videos</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div style={{ 
                                gridColumn: '1 / -1', 
                                textAlign: 'center', 
                                padding: '80px', 
                                background: '#FFF'
                            }}>
                                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>No talent found.</h3>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
