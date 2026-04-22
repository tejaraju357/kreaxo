import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

/* ── Scroll Reveal Hook ── */
function useScrollReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); } },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return ref;
}

function Reveal({ children, delay = 0, style = {} }) {
    const ref = useScrollReveal();
    return (
        <div ref={ref} className="reveal-box" style={{ transitionDelay: `${delay}ms`, ...style }}>
            {children}
        </div>
    );
}

export default function AboutUs() {
    return (
        <div className="about-page" style={{ background: 'var(--bg-primary)' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;600;800&display=swap');

                :root {
                    --font-serif: 'Playfair Display', serif;
                    --font-sans: 'Inter', sans-serif;
                    --color-brand: var(--accent-primary);
                    --color-yellow: #F4B400;
                    --color-blue: #8EC9E1;
                    --text-primary: #1A0F2E;
                    --text-muted: #6B7280;
                }

                .about-page {
                    font-family: var(--font-sans);
                    color: var(--text-primary);
                    overflow-x: hidden;
                    background: var(--bg-primary);
                }

                .reveal-box {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .reveal-box.revealed {
                    opacity: 1;
                    transform: none;
                }

                .magazine-header {
                    text-align: center;
                    padding: 120px 0 80px;
                }
                .magazine-header h1 {
                    font-family: var(--font-serif);
                    font-size: clamp(4rem, 10vw, 8rem);
                    text-transform: uppercase;
                    margin: 0;
                    line-height: 0.9;
                    letter-spacing: -2px;
                }
                .magazine-header .tagline {
                    color: var(--color-brand);
                    font-weight: 800;
                    font-size: 1.1rem;
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    margin-top: 24px;
                }

                .story-section {
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    gap: 80px;
                    align-items: flex-start;
                    padding-bottom: 120px;
                }
                .story-text h2 {
                    font-family: var(--font-serif);
                    font-size: 3.2rem;
                    line-height: 1.1;
                    margin-bottom: 32px;
                    color: var(--text-primary);
                }
                .story-text span.accent { color: var(--color-brand); }
                
                .story-body {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: var(--text-muted);
                    margin-bottom: 40px;
                }

                .quote-box {
                    background: var(--bg-secondary);
                    border-left: 4px solid var(--color-brand);
                    padding: 40px;
                    border-radius: 4px 24px 24px 4px;
                    margin: 48px 0;
                    font-family: var(--font-serif);
                    font-size: 1.6rem;
                    font-style: italic;
                    color: var(--text-primary);
                    line-height: 1.4;
                }

                .founder-image-wrapper {
                    position: relative;
                    border-radius: 48px;
                    overflow: hidden;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.06);
                    background: var(--bg-secondary);
                    margin-bottom: 40px;
                    border: 1px solid var(--border);
                    cursor: pointer;
                }
                .founder-info-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(16, 20, 30, 0.9) 0%, transparent 60%);
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 40px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    color: #FFF;
                }
                .founder-image-wrapper:hover .founder-info-overlay {
                    opacity: 1;
                    transform: translateY(0);
                }
                .founder-image-wrapper:hover img {
                    transform: scale(1.05);
                }
                .founder-image-wrapper img {
                    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .founder-image-wrapper img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .words-section {
                    text-align: center;
                    padding: 100px 0;
                    background: var(--bg-primary);
                    overflow: hidden;
                }
                .words-section h2 {
                    font-family: var(--font-serif);
                    font-size: 3rem;
                    text-transform: uppercase;
                    margin-bottom: 60px;
                }

                .motto-bar {
                    width: 120%;
                    margin-left: -10%;
                    padding: 40px 0;
                    font-weight: 900;
                    font-size: 1.6rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: #000;
                    margin-bottom: 24px;
                    white-space: nowrap;
                }
                .bar-yellow { background: var(--color-yellow); transform: rotate(-2.5deg); }
                .bar-blue { background: var(--color-blue); transform: rotate(1.5deg); }
                .bar-red { background: var(--color-brand); transform: rotate(-1deg); color: #FFF; }

                .what-we-do-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 100px;
                    align-items: flex-start;
                    padding: 120px 0;
                }
                .what-we-do-text h2 {
                    font-family: var(--font-serif);
                    font-size: 4rem;
                    text-transform: uppercase;
                    margin-bottom: 32px;
                }
                .services-list-container {
                    margin-top: 48px;
                    background: var(--bg-secondary);
                    padding: 48px;
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.02);
                    border: 1px solid var(--border);
                }
                .service-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px 0;
                    border-bottom: 1px solid var(--border);
                    font-weight: 600;
                    color: var(--text-primary);
                    font-size: 1.1rem;
                }
                .service-item:last-child { border-bottom: none; }
                .service-item svg { color: var(--color-brand); }

                @media (max-width: 992px) {
                    .story-section, .what-we-do-section { grid-template-columns: 1fr; }
                    .motto-bar { font-size: 0.9rem; width: 100%; margin-left: 0; padding: 24px 0; }
                }
            `}</style>

            <Navbar />

            <div className="container">
                {/* ── HEADER ── */}
                <header className="magazine-header">
                    <Reveal>
                        <h1>ABOUT US</h1>
                        <div className="tagline">TURNING IDEAS INTO IMPACT</div>
                    </Reveal>
                </header>

                {/* ── OUR STORY / FOUNDERS ── */}
                <section className="story-section">
                    <Reveal>
                        <div className="story-text">
                            <h2>
                                EVERY BRAND BEGINS WITH A STORY.<br />
                                <span className="accent">KREAXO BEGAN WITH A DREAM.</span>
                            </h2>
                            <div className="story-body">
                                <p>
                                    While most were focused only on short-term goals, we had a different vision. 
                                    We noticed something important — many talented businesses and creators had great ideas 
                                    but struggled to communicate them to the world in a way that drove real growth.
                                </p>
                                <p>
                                    And that&apos;s how <strong>Kreaxo</strong> was born. What started as a passion project 
                                    has evolved into a powerhouse for marketing planning, brand strategy, and digital growth. 
                                    Built on curiosity, experimentation, and a commitment to excellence, Kreaxo is driven by a simple belief:
                                </p>
                            </div>

                            <div className="quote-box">
                                &ldquo;What if strategy and creativity could help these ideas reach the people who need them most?&rdquo;
                            </div>

                            <div style={{ fontWeight: 800, fontSize: '1.4rem', fontStyle: 'italic', color: 'var(--text-primary)', marginTop: '40px' }}>
                                GREAT IDEAS DESERVE GREAT VISIBILITY.
                            </div>
                        </div>
                    </Reveal>
                    
                    <div className="founders-gallery">
                        <Reveal delay={200}>
                            <div className="founder-image-wrapper" style={{ marginBottom: 0 }}>
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" alt="Vishal Vardhan Irugu" />
                                <div className="founder-info-overlay">
                                    <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.4rem' }}>VISHAL VARDHAN IRUGU</h4>
                                    <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Founder & Growth Strategist</p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>
            </div>

            {/* ── WORDS SECTION ── */}
            <section className="words-section">
                <Reveal>
                    <h2>WE STRONGLY FOLLOW THE WORDS</h2>
                </Reveal>
                
                <Reveal delay={100}>
                    <div className="motto-bar bar-yellow">
                        COLLABORATION IS AT THE HEART OF EVERYTHING WE DO
                    </div>
                </Reveal>
                <Reveal delay={200}>
                    <div className="motto-bar bar-blue">
                        THERE ARE NO RULES TO CREATIVITY
                    </div>
                </Reveal>
                <Reveal delay={300}>
                    <div className="motto-bar bar-red">
                        OUR WORK DOESN&apos;T JUST EXIST - IT DRIVES CHANGE
                    </div>
                </Reveal>
            </section>

            <div className="container">
                {/* ── WHAT WE DO SECTION ── */}
                <section className="what-we-do-section">
                    <Reveal>
                        <div className="founder-image-wrapper" style={{ borderRadius: '48px', marginBottom: 0 }}>
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Teja Sri Ganguboina" />
                            <div className="founder-info-overlay">
                                <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.4rem' }}>TEJA SRI GANGUBOINA</h4>
                                <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Co-Founder & Head of Marketing</p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={200}>
                        <div className="what-we-do-text">
                            <h2>WHAT WE DO</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1.8 }}>
                                At Kreaxo, we help brands move beyond ordinary marketing. 
                                We focus on smart strategies, meaningful storytelling, and measurable growth.
                            </p>
                            
                            <div className="services-list-container">
                                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--color-brand)', letterSpacing: '4px', marginBottom: '24px' }}>OUR CORE ARCHITECTURE</div>
                                {[
                                    'Strategic Marketing Planning',
                                    'Brand Positioning & Identity',
                                    'Digital Marketing Campaigns',
                                    'Content Strategy',
                                    'Social Media Growth',
                                    'Creative Brand Communication'
                                ].map((service, i) => (
                                    <div className="service-item" key={i}>
                                        <FiCheckCircle size={20} />
                                        <span>{service}</span>
                                    </div>
                                ))}
                            </div>

                            <p style={{ marginTop: '48px', color: 'var(--color-brand)', fontWeight: 800, fontStyle: 'italic', fontSize: '1.1rem' }}>
                                We don&apos;t just promote brands — we help them build a lasting presence.
                            </p>
                        </div>
                    </Reveal>
                </section>

                {/* ── CTA ── */}
                <section style={{ textAlign: 'center', padding: '160px 0' }}>
                    <Reveal>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', marginBottom: '48px', letterSpacing: '-2px' }}>READY TO START YOUR STORY?</h3>
                        <Link to="/contact-us" className="btn btn-primary" style={{ padding: '24px 80px', fontSize: '1.2rem', borderRadius: '60px', background: 'var(--accent-primary)', border: 'none', fontWeight: 800 }}>
                            CONTACT US NOW <FiArrowRight />
                        </Link>
                    </Reveal>
                </section>
            </div>

            <Footer />
        </div>
    );
}
