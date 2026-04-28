import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios';
import { FiArrowRight, FiSearch, FiStar, FiUsers, FiShield, FiBriefcase, FiZap, FiMessageCircle, FiCheckCircle } from 'react-icons/fi';

export default function Landing() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ creators: 0, brands: 0, collaborations: 0 });
    const [featuredWorks, setFeaturedWorks] = useState([]);
    const [creators, setCreators] = useState([]);
    const [brands, setBrands] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        API.get('/public/stats').then(res => setStats(res.data || { creators: 0, brands: 0, collaborations: 0 })).catch(() => {});
        API.get('/public/works/featured').then(res => setFeaturedWorks(res.data || [])).catch(() => {});
        API.get('/public/creators').then(res => setCreators(res.data || [])).catch(() => {});
        API.get('/public/brands').then(res => setBrands(res.data || [])).catch(() => {});
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/our-work?q=${searchQuery}`);
        }
    };

    return (
        <div className="page-container" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <Navbar />

           

            {/* Premium Hero Section */}
            <section className="hero" style={{ paddingTop: '160px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '1000px' }}>
                    <div className="hero-tag fade-in" style={{ 
                        animationDelay: '0.1s', 
                        background: 'transparent', 
                        border: '1px solid var(--accent-primary)', 
                        color: 'var(--accent-primary)',
                        marginBottom: '32px',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        letterSpacing: '1px'
                    }}>
                        <FiZap /> Build Creative Teams. Seamlessly.
                    </div>
                    
                    <h1 className="hero-title slide-up" style={{ 
                        fontSize: '6.5rem', 
                        animationDelay: '0.2s', 
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '-2px',
                        fontFamily: 'var(--font-serif)',
                        lineHeight: 0.9,
                        marginBottom: '20px'
                    }}>
                        BEYOND LIMITS
                    </h1>

                    <p className="hero-subtitle slide-up" style={{ animationDelay: '0.3s', maxWidth: '700px', margin: '24px auto', fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 400, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                        Hire verified creative freelancers, photographers, and UGC creators across the globe down to the exact metric.
                    </p>
                </div>
            </section>

             {/* 1. Top-Level Scrolling Marquee - HIGH IMPACT FOREGROUND */}
            <div style={{ 
                position: 'relative', 
                zIndex: 100, 
                height: '650px', 
                marginBottom: '-120px',
                overflow: 'visible',
                background: 'transparent'
            }}>
                <div style={{ 
                    display: 'flex', 
                    gap: '40px', 
                    padding: '60px 0',
                    transform: 'rotate(-4deg) scale(1.05)', 
                    whiteSpace: 'nowrap', 
                    animation: 'marqueeScroll 50s linear infinite' 
                }}>
                    {[
                        { url: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800', tag: 'BEYOND LIMITS' },
                        { url: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?auto=format&fit=crop&q=80&w=800', tag: 'SEE YOU SOON' },
                        { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800', tag: 'KREAXO AGENCY' },
                        { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800', tag: 'BEYOND LIMITS' },
                        { url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=800', tag: 'SEE YOU SOON' },
                        { url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=800', tag: 'KREAXO AGENCY' },
                        { url: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800', tag: 'BEYOND LIMITS' },
                        { url: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?auto=format&fit=crop&q=80&w=800', tag: 'SEE YOU SOON' }
                    ].map((item, i) => (
                        <div key={i} style={{
                            minWidth: '400px',
                            height: '500px',
                            borderRadius: '60px',
                            background: `url(${item.url}) center/cover no-repeat`,
                            boxShadow: '0 40px 80px rgba(0,0,0,0.15)',
                            position: 'relative',
                            overflow: 'auto'
                        }}>
                             <div style={{
                                 position: 'absolute',
                                 bottom: '40px',
                                 left: '40px',
                                 background: 'var(--accent-primary)',
                                 color: 'var(--bg-primary)',
                                 padding: '12px 24px',
                                 borderRadius: '12px',
                                 fontWeight: 800,
                                 fontSize: '0.9rem',
                                 letterSpacing: '1px',
                                 boxShadow: 'var(--accent-glow)'
                             }}>
                                 {item.tag}
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* JOB DONE Typography Section */}
            <section style={{ padding: '120px 0', background: 'var(--bg-primary)', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                <div className="container" style={{ maxWidth: '850px' }}>
                    <h2 style={{ fontSize: '5.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '32px', letterSpacing: '-1.5px', textTransform: 'uppercase' }}>
                        JOB DONE
                    </h2>
                    <p style={{ fontSize: '1.6rem', lineHeight: '1.6', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                        We're a creative agency team that specializes in providing end-to-end services to help businesses get the required task DONE.
                    </p>
                </div>
            </section>

            {/* Static Pentagonal Services Section */}
            <section className="section" style={{ background: 'var(--bg-primary)', padding: '100px 0', overflow: 'hidden' }}>
                <style>{`
                    @keyframes marqueeScroll {
                        0% { transform: rotate(-5deg) scale(1.1) translateX(0); }
                        100% { transform: rotate(-5deg) scale(1.1) translateX(-50%); }
                    }
                    .static-pentagon-container {
                        position: relative;
                        width: 1000px;
                        height: 900px;
                        margin: 0 auto;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 5;
                    }
                    .static-item {
                        position: absolute;
                        width: 320px;
                        height: 320px;
                        background: var(--bg-card);
                        border: 2px solid var(--border);
                        border-radius: 48px;
                        padding: 40px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        text-decoration: none;
                        transition: all 0.3s ease;
                    }
                    .static-item:hover {
                        border-color: var(--accent-primary);
                        box-shadow: var(--shadow-lg);
                        z-index: 10;
                    }
                    .pos-1 { top: 0%; left: 50%; transform: translate(-50%, -10%); }
                    .pos-2 { top: 30%; left: 90%; transform: translate(-50%, -50%); }
                    .pos-3 { top: 75%; left: 75%; transform: translate(-50%, -50%); }
                    .pos-4 { top: 75%; left: 25%; transform: translate(-50%, -50%); }
                    .pos-5 { top: 30%; left: 10%; transform: translate(-50%, -50%); }

                    @media (max-width: 1100px) {
                        .static-pentagon-container { width: 100%; height: auto; display: grid; grid-template-columns: 1fr; gap: 32px; padding: 40px; }
                        .static-item { position: relative; top: auto; left: auto; transform: none; width: 100%; height: auto; min-height: 280px; }
                        .pos-1, .pos-2, .pos-3, .pos-4, .pos-5 { transform: none; left: auto; top: auto; }
                    }
                `}</style>
                <div className="container">
                    <div className="static-pentagon-container">
                        {[
                            { title: 'Photographer', desc: 'Capture products, events, and brand identity with cinematic precision.', class: 'pos-1' },
                            { title: 'Videographer', desc: 'Storytelling through brand films, high-impact reels, and campaigns.', class: 'pos-2' },
                            { title: 'SMM', desc: 'Data-driven strategy and execution to scale your digital presence.', class: 'pos-3' },
                            { title: 'UGC Creator', desc: 'Authentic user content that builds trust and drives conversions.', class: 'pos-4' },
                            { title: 'Editor', desc: 'Professional post-production that brings your vision to perfection.', class: 'pos-5' }
                        ].map((srv, i) => (
                            <Link to="/services" key={i} className={`static-item ${srv.class}`}>
                                <div>
                                    <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, marginBottom: '20px' }}>SERVICE</h4>
                                    <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '15px' }}>{srv.title}</h3>
                                </div>
                                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{srv.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Massive Featured Works Section - Replaced Images per Request */}
            <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', paddingBottom: '100px' }}>
                <div className="container" style={{ maxWidth: '1600px', width: '95%' }}>
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '80px', marginTop: '40px' }}>
                        <h2 className="section-title" style={{ fontWeight: 500, fontFamily: 'var(--font-serif)', fontSize: '4.5rem', letterSpacing: '-1.5px', textTransform: 'uppercase' }}>Our Work.</h2>
                    </div>
                    <div className="featured-works-grid">
                        {[
                            { id: 'd1', title: 'PHOTOGRAPHER', category: 'PRODUCTS • EVENTS • BRANDING', image_url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1200' },
                            { id: 'd2', title: 'VIDEOGRAPHER', category: 'REELS • BRAND FILMS', image_url: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=1200' },
                            { id: 'd3', title: 'SOCIAL MEDIA MANAGER', category: 'RETAINERS • EXECUTION', image_url: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?auto=format&fit=crop&q=80&w=1200' },
                            { id: 'd4', title: 'UGC CREATOR', category: 'PERFORMANCE • NATIVE', image_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200' }
                        ].map((work, index) => (
                            <Link to={`/our-work`} key={work.id} className="slide-up hover-float" style={{
                                textDecoration: 'none',
                                position: 'relative',
                                height: '600px',
                                borderRadius: '48px',
                                overflow: 'hidden',
                                animationDelay: `${index * 0.1}s`,
                                background: `url(${work.image_url}) center/cover no-repeat`,
                                boxShadow: 'var(--shadow-lg)'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: '30px',
                                    textAlign: 'left'
                                }}>
                                    <h3 style={{ 
                                        fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)', 
                                        fontFamily: 'var(--font-serif)', 
                                        color: '#FFF', 
                                        marginBottom: '16px',
                                        lineHeight: 1.1,
                                        wordWrap: 'break-word'
                                    }}>{work.title}</h3>
                                    
                                    <div style={{ display: 'flex' }}>
                                        <div style={{
                                            background: 'var(--accent-primary)',
                                            color: 'var(--bg-primary)',
                                            padding: '8px 16px',
                                            borderRadius: '50px',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase'
                                        }}>
                                            {work.category}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>


            <Footer />
        </div>
    );
}
