import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios';
import { FiFilter, FiImage, FiVideo, FiMonitor, FiCamera, FiArrowRight } from 'react-icons/fi';

export default function OurWork() {
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        API.get('/public/works')
            .then(res => setWorks(Array.isArray(res.data) ? res.data : []))
            .catch(() => { setWorks([]); })
            .finally(() => setLoading(false));
    }, []);

    const categories = ['All', 'Photography', 'Videography', 'UGC', 'SMM', 'Editing'];
    
    // Simulate filtering locally if our backend just returns all works
    const filteredWorks = filter === 'All' 
        ? works 
        : works.filter(w => (w.category || '').toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="page-container">
            <Navbar />
            <section className="section" style={{ paddingTop: 140, paddingBottom: 60, background: 'var(--bg-primary)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="section-header slide-up">
                        <h1 className="section-title" style={{ fontSize: '5rem', fontFamily: 'var(--font-serif)', letterSpacing: '-1.5px', textTransform: 'uppercase' }}>Our Work</h1>
                    </div>

                    {loading ? (
                        <div className="loading" style={{ minHeight: '300px' }}><div className="spinner"></div></div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                            gap: '40px',
                            marginTop: '60px'
                        }}>
                            {filteredWorks.length > 0 ? (
                                filteredWorks.map((work, index) => (
                                <div key={work.id || index} className="slide-up hover-float" style={{
                                    position: 'relative',
                                    height: '600px',
                                    borderRadius: '48px',
                                    overflow: 'hidden',
                                    padding: 0,
                                    animationDelay: `${index * 0.1}s`,
                                    background: `url(${work.image_url || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200'}) center/cover no-repeat`,
                                    boxShadow: 'var(--shadow-lg)',
                                    cursor: 'pointer',
                                    border: 'none'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        padding: '40px',
                                        textAlign: 'left'
                                    }}>
                                        <h3 style={{ 
                                            fontSize: '3.5rem', 
                                            fontFamily: 'var(--font-serif)', 
                                            color: '#FFF', 
                                            marginBottom: '16px',
                                            lineHeight: 1
                                        }}>{work.title}</h3>
                                        
                                        {work.category && (
                                            <div style={{ display: 'flex' }}>
                                                <div style={{
                                                    background: '#A11D25',
                                                    color: '#FFF',
                                                    padding: '12px 24px',
                                                    borderRadius: '50px',
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem',
                                                    letterSpacing: '1.5px',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {work.category}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px', background: '#F5F5F5', borderRadius: '48px' }}>
                                <h3 style={{ fontSize: '2rem', color: '#0F131D', fontFamily: 'var(--font-serif)' }}>PORTFOLIO COMING SOON</h3>
                                <p style={{ color: '#9CA3AF' }}>Our talented creators are currently updating their showcases.</p>
                            </div>
                        )}
                    </div>
                )}
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="section" style={{ background: 'var(--bg-card)' }}>
                 <div className="container" style={{ textAlign: 'center' }}>
                     <div className="card-glass hover-float" style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--accent-gradient)', color: 'white' }}>
                         <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Ready to start your next project?</h2>
                         <p style={{ fontSize: '1.2rem', marginBottom: '32px', opacity: 0.9 }}>Join our platform today to hire or get hired.</p>
                         <button className="btn btn-secondary btn-lg" style={{ borderRadius: '30px' }}>Join the Platform</button>
                     </div>
                 </div>
            </section>
            
            <Footer />
        </div>
    );
}
