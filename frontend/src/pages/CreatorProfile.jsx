import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios';
import { FiArrowLeft, FiInstagram, FiStar, FiYoutube } from 'react-icons/fi';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function CreatorProfile() {
    const { id } = useParams();
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/public/creators')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                const found = data.find(c => c.id === parseInt(id));
                setCreator(found);
            })
            .catch(() => { setCreator(null); })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"></div></div>;
    if (!creator) return <div style={{ paddingTop: 100, textAlign: 'center' }}>Creator Not Found</div>;

    const getCity = (id) => ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata'][(id || 0) % 4];

    return (
        <div className="page-container" style={{ background: '#FFF' }}>
            <Navbar />
            
            <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', maxWidth: '1200px' }}>
                
                {/* Back Button */}
                <div style={{ marginBottom: '60px' }}>
                    <Link to="/services" style={{ 
                        color: '#A11D25', 
                        textDecoration: 'none', 
                        fontSize: '0.9rem', 
                        fontWeight: 700, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        <FiArrowLeft /> Back to Creators
                    </Link>
                </div>

                {/* Simplified Magazine Header */}
                <div style={{ marginBottom: '100px' }}>
                    <h4 style={{ 
                        color: '#A11D25', 
                        fontSize: '0.9rem', 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        letterSpacing: '4px', 
                        marginBottom: '20px' 
                    }}>
                        {creator.category?.toUpperCase() || 'PROFESSIONAL CREATOR'}
                    </h4>
                    
                    <h1 style={{ 
                        fontSize: '8rem', 
                        fontFamily: 'var(--font-serif)', 
                        color: '#0F131D', 
                        lineHeight: 0.9, 
                        letterSpacing: '-4px', 
                        textTransform: 'uppercase',
                        marginBottom: '40px'
                    }}>
                        {creator.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0F131D', fontWeight: 600, fontSize: '1.2rem' }}>
                            <FaMapMarkerAlt color="#A11D25" /> {getCity(creator.id)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0F131D', fontWeight: 600, fontSize: '1.2rem' }}>
                            <FiStar color="#FFD700" style={{ fill: '#FFD700' }} /> 5.0 KREAXO RATING
                        </div>
                    </div>
                </div>

                {/* Actual Performance Stats */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '40px',
                    borderTop: '1px solid #F3F4F6',
                    paddingTop: '60px'
                }}>
                    {creator.instagram && (
                        <>
                            <div>
                                <p style={{ color: '#9CA3AF', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <FiInstagram color="#e1306c" /> IG FOLLOWERS
                                </p>
                                <h2 style={{ fontSize: '4.5rem', fontWeight: 800, color: '#0F131D', margin: 0 }}>
                                    {creator.insta_followers > 0 ? (creator.insta_followers >= 1000 ? (creator.insta_followers / 1000).toFixed(1) + 'K' : creator.insta_followers) : 'N/A'}
                                </h2>
                            </div>
                            <div>
                                <p style={{ color: '#9CA3AF', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <FiInstagram color="#e1306c" /> IG POSTS
                                </p>
                                <h2 style={{ fontSize: '4.5rem', fontWeight: 800, color: '#0F131D', margin: 0 }}>
                                    {creator.insta_posts > 0 ? creator.insta_posts : 'N/A'}
                                </h2>
                            </div>
                        </>
                    )}

                    {creator.youtube && (
                        <>
                            <div>
                                <p style={{ color: '#9CA3AF', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <FiYoutube color="#ff0000" /> YT SUBSCRIBERS
                                </p>
                                <h2 style={{ fontSize: '4.5rem', fontWeight: 800, color: '#0F131D', margin: 0 }}>
                                    {creator.youtube_subscribers > 0 ? (creator.youtube_subscribers >= 1000 ? (creator.youtube_subscribers / 1000).toFixed(1) + 'K' : creator.youtube_subscribers) : 'N/A'}
                                </h2>
                            </div>
                            <div>
                                <p style={{ color: '#9CA3AF', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <FiYoutube color="#ff0000" /> YT VIDEOS
                                </p>
                                <h2 style={{ fontSize: '4.5rem', fontWeight: 800, color: '#0F131D', margin: 0 }}>
                                    {creator.youtube_videos > 0 ? creator.youtube_videos : 'N/A'}
                                </h2>
                            </div>
                        </>
                    )}
                </div>

                {/* Simple Action Call */}
                <div style={{ marginTop: '100px', textAlign: 'center' }}>
                     <Link to="/contact-us" style={{ 
                         display: 'inline-block',
                         padding: '24px 60px',
                         background: '#A11D25',
                         color: '#FFF',
                         fontSize: '1.1rem',
                         fontWeight: 800,
                         textDecoration: 'none',
                         borderRadius: '100px',
                         letterSpacing: '1px',
                         transition: '0.3s'
                     }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                        BOOK THIS CREATOR
                     </Link>
                </div>

            </div>
            <Footer />
        </div>
    );
}
