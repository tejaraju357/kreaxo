import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SimplePage({ title }) {
    
    // Generate dummy robust content based on title to match the premium Foxpop feel
    const renderContent = () => {
        switch(title) {
            case 'About Us':
                return (
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Our Mission</h2>
                        <p style={{ marginBottom: '24px' }}>
                            At Kreaxo, we saw a gap between brands looking for top-tier creative talent and the scattered, unstructured landscape of freelancers in India. 
                            Our mission is to bridge this gap by providing a trusted, managed, and verified marketplace. We curate a vetted community of Photographers, Videographers, UGC Creators, and Social Media Strategists to help tell your brand's unique story.
                        </p>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Why Choose Kreaxo?</h2>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li><strong>KYC Verified Talent</strong> - We physically and electronically verify every creator on our platform.</li>
                            <li><strong>Secure Payments</strong> - Your payment is held securely in escrow until the final deliverables are approved.</li>
                            <li><strong>PAN India Fulfillment</strong> - Whether you are shooting in Mumbai, Delhi, or Bangalore, we have local experts ready.</li>
                            <li><strong>End-to-End Management</strong> - Our dedicated team helps you match, brief, and manage your hired creators.</li>
                        </ul>
                    </div>
                );
            case 'Privacy Policy':
                return (
                    <div>
                        <p style={{ marginBottom: '24px' }}><strong>Effective Date: January 1, 2026</strong></p>
                        <p style={{ marginBottom: '24px' }}>
                            Kreaxo Multimedia Private Limited ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (the "Site") or use our services.
                        </p>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>1. Information We Collect</h3>
                        <p style={{ marginBottom: '24px' }}>We may collect personal information such as your name, email address, phone number, and payment information when you register for an account, book a creator, or interact with our services. We also automatically collect certain device information, logs, and site usage data.</p>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>2. How We Use Your Information</h3>
                        <p style={{ marginBottom: '24px' }}>We use your information to facilitate bookings, process payments, provide customer support, improve our matching algorithms, and send you important updates regarding your account or our services.</p>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>3. Information Sharing</h3>
                        <p style={{ marginBottom: '24px' }}>We do not sell your personal data. We may share your information with verified creators (if you are a brand) or brands (if you are a creator) solely for the purpose of fulfilling a collaboration. We may also share data with trusted third-party service providers (like payment processors) necessary to operate our platform.</p>
                    </div>
                );
            case 'Terms & Conditions':
                return (
                    <div>
                        <p style={{ marginBottom: '24px' }}>Welcome to Kreaxo! By accessing our website and using our services, you agree to comply with and be bound by the following Terms and Conditions.</p>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>1. Service Overview</h3>
                        <p style={{ marginBottom: '24px' }}>Kreaxo provides an online platform connecting brands seeking creative services with independent multimedia professionals ("Creators"). We act as an intermediary to facilitate communication, secure agreements, and process payments.</p>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>2. User Responsibilities</h3>
                        <p style={{ marginBottom: '24px' }}>Users must provide accurate information during registration. Brands must provide clear project briefs and requirements. Creators must deliver work that adheres to the agreed-upon brief and timeline. You agree not to bypass the platform by arranging payments or contracts outside of Kreaxo with individuals introduced through our site.</p>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>3. Intellectual Property</h3>
                        <p style={{ marginBottom: '24px' }}>Unless explicitly stated otherwise in a specific project contract, Creators retain the copyright to their raw files, but grant the Brand a worldwide, royalty-free license to use the final delivered content for the agreed-upon purposes upon full payment.</p>
                    </div>
                );
            case 'Refund Policy':
                return (
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Refunds and Disputes</h2>
                        <p style={{ marginBottom: '24px' }}>
                            Since we hold payments securely until delivery, your funds are protected. A refund may be issued under the following circumstances:
                        </p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li>The creator fails to show up for a scheduled offline shoot without valid prior notice.</li>
                            <li>The creator fails to deliver the agreed-upon assets within the deadline and no extension is agreed upon.</li>
                            <li>The delivered assets severely deviate from the mutually approved project brief, and the creator is unable or unwilling to revise them.</li>
                        </ul>
                        <p>To request a refund, you must file a dispute through your dashboard or contact support within 3 days of receiving the final deliverables.</p>
                    </div>
                );
            case 'Cancellation Policy':
                return (
                    <div>
                        <p style={{ marginBottom: '24px' }}>We understand that plans change. Our cancellation policy is designed to be fair to both Brands and Creators.</p>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>For Brands</h3>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li><strong>More than 7 days before shoot/deadline:</strong> 100% refund of the held deposit.</li>
                            <li><strong>Within 3-7 days:</strong> 50% refund. The remaining 50% is compensated to the creator for blocked time.</li>
                            <li><strong>Less than 48 hours:</strong> No refund on the initial deposit.</li>
                        </ul>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>For Creators</h3>
                        <p style={{ marginBottom: '24px' }}>Creators who cancel a confirmed booking without a valid, sudden emergency may face penalties, including demotion in search rankings or temporary suspension, to ensure reliability for our brand partners.</p>
                    </div>
                );
            case 'Anti Discrimination Policy':
                return (
                    <div>
                        <p style={{ marginBottom: '24px' }}>
                            Kreaxo is committed to fostering an inclusive, welcoming, and safe environment for all our users—brands, creators, and staff alike.
                        </p>
                        <p style={{ marginBottom: '24px' }}>
                            We strictly prohibit any form of discrimination, harassment, or exclusion based on race, color, ethnicity, national origin, religion, gender, gender identity or expression, sexual orientation, age, disability, marital status, or any other legally protected characteristic.
                        </p>
                        <p>
                            Any user found violating this policy, whether through platform messaging, offline shoots, or project briefs, will be subject to immediate investigation and permanent removal from the Kreaxo platform.
                        </p>
                    </div>
                );
            case 'Frequently Asked Questions':
                return (
                    <div>
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>How does payment work?</h3>
                            <p>Brands pay upfront into our secure escrow system. The funds are held safely by Kreaxo and are only released to the Creator once the final deliverables are approved by the brand.</p>
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Are the creators vetted?</h3>
                            <p>Yes. Every Creator on our platform undergoes a manual KYC (Know Your Customer) check and portfolio review before they are permitted to accept bookings.</p>
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Can I negotiate rates?</h3>
                            <p>Creators set their own starting package rates. However, if your project has custom requirements, you can submit a custom brief through the platform, and Creators can provide tailored quotes for you to review.</p>
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Who owns the final content?</h3>
                            <p>Typically, the brand receives full usage rights for the final delivered video or images. However, raw files and copyright ownership generally remain with the creator unless a specific buyout clause is negotiated during the booking process.</p>
                        </div>
                    </div>
                );
            default:
                return <p>Content is currently being updated by our legal and operations team. Please check back later.</p>;
        }
    };

    return (
        <div className="page-container" style={{ background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px', minHeight: '60vh' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '40px', letterSpacing: '-1.5px', color: 'var(--text-primary)', borderBottom: '2px solid var(--border)', paddingBottom: '24px' }}>
                    {title}
                </h1>
                <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                    {renderContent()}
                </div>
            </div>
            <Footer />
        </div>
    );
}
