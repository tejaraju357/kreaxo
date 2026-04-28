import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios';

export default function PublicBrands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/public/brands')
            .then(res => setBrands(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page-container" style={{ background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '1200px' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '16px' }}>KREAXO · PARTNER NETWORK</p>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
                        Trusted by <span style={{ color: '#0f766e' }}>innovative</span> brands
                    </h1>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>Loading brands...</div>
                ) : brands.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏢</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>No brands yet</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Brand partners will be showcased here soon.</p>
                    </div>
                ) : (
                    <div className="card-grid" style={{ gap: '32px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {brands.map((brand, i) => (
                            <div key={brand.id} className="card hover-float" style={{ padding: 0, borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                                {/* Brand Banner Background */}
                                <div style={{ height: '120px', background: `linear-gradient(to right, #0f766e, #115e59)`, position: 'relative' }}>
                                    {/* Logo Circle Overlapping */}
                                    <div style={{ position: 'absolute', bottom: '-30px', left: '24px', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-card)', padding: '4px', border: '2px solid var(--border)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                        {brand.logo ? (
                                            <img src={brand.logo} alt={brand.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                                {brand.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div style={{ padding: '40px 24px 24px 24px' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>{brand.name}</h3>
                                    {brand.industry && (
                                        <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, border: '1px solid var(--border)' }}>
                                            {brand.industry}
                                        </span>
                                    )}
                                    <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, minHeight: '60px' }}>
                                        {brand.description || 'Verified partner brand actively publishing briefs on Kreaxo Match.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
