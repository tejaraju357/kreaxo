import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactUs() {
    return (
        <div className="page-container" style={{ paddingTop: '100px', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="container" style={{ maxWidth: '800px', padding: '60px 20px', minHeight: '60vh' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-1px' }}>Contact Us</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '40px' }}>
                    Have a question or want to work with us? We'd love to hear from you. Fill out the form below and we'll be in touch shortly.
                </p>

                <div className="card hover-float" style={{ padding: '40px', background: 'var(--bg-secondary)' }}>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Message Sent!'); }}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label className="form-label">Name</label>
                            <input type="text" className="form-input" placeholder="Your name" required />
                        </div>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label className="form-label">Email</label>
                            <input type="email" className="form-input" placeholder="Your email" required />
                        </div>
                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label className="form-label">Message</label>
                            <textarea className="form-input" placeholder="How can we help?" rows="5" required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Send Message</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
