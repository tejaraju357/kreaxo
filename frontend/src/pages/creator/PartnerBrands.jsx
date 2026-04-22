import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';

export default function PartnerBrands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/creator/brands')
            .then(res => setBrands(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout role="creator">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Partner Brands</h1>
                        <p className="page-subtitle">Brands you are collaborating with</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : brands.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🤝</div>
                        <h3>No partner brands yet</h3>
                        <p>Accept collaboration proposals to see them here</p>
                    </div>
                ) : (
                    <div className="grid">
                        {brands.map(brand => (
                            <div key={brand.id} className="card brand-card">
                                {brand.logo ? (
                                    <img src={brand.logo} alt={brand.name} className="brand-logo" />
                                ) : (
                                    <div className="brand-logo-placeholder">{brand.name?.charAt(0)}</div>
                                )}
                                <h3>{brand.name}</h3>
                                <p className="category">{brand.industry || 'Business'}</p>
                                <p className="description">{brand.description}</p>
                                {brand.website && (
                                    <a href={brand.website} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem', display: 'block', textAlign: 'center', boxSizing: 'border-box' }}>
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
        </DashboardLayout>
    );
}
