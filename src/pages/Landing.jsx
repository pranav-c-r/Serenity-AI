import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.scss';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Close mobile menu after clicking
    }
  };

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-brand">
          <Link to="/">Serenity AI</Link>
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#features" className="nav-link" onClick={(e) => scrollToSection(e, 'features')}>Features</a>
          <a href="#pricing" className="nav-link" onClick={(e) => scrollToSection(e, 'pricing')}>Pricing</a>
          <a href="#team" className="nav-link" onClick={(e) => scrollToSection(e, 'team')}>Team</a>
          <a href="#contact" className="nav-link" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a>
          <a href="#support" className="nav-link" onClick={(e) => scrollToSection(e, 'support')}>Support</a>
        </div>

        <div className="nav-buttons">
          <Link to="/signup" className="btn btn-login">Login</Link>
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
        </div>

        <button className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Serenity AI</h1>
          <p>Your personal AI companion for a more peaceful and productive life.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
            <a href="#features" className="btn btn-secondary" onClick={(e) => scrollToSection(e, 'features')}>Learn More</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Assistance</h3>
            <p>Get intelligent help with your daily tasks and decision-making.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalized Experience</h3>
            <p>Tailored recommendations and insights based on your preferences.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is protected with enterprise-grade security.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <h2>Pricing Plans</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Basic</h3>
            <div className="price">$9<span>/month</span></div>
            <ul>
              <li>Basic AI assistance</li>
              <li>5 tasks per day</li>
              <li>Email support</li>
            </ul>
            <Link to="/signup" className="btn btn-primary">Choose Plan</Link>
          </div>
          <div className="pricing-card featured">
            <h3>Pro</h3>
            <div className="price">$19<span>/month</span></div>
            <ul>
              <li>Advanced AI features</li>
              <li>Unlimited tasks</li>
              <li>Priority support</li>
              <li>Custom integrations</li>
            </ul>
            <Link to="/signup" className="btn btn-primary">Choose Plan</Link>
          </div>
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">Custom</div>
            <ul>
              <li>Custom AI solutions</li>
              <li>Dedicated support</li>
              <li>API access</li>
              <li>SLA guarantee</li>
            </ul>
            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team">
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-image"></div>
            <h3>Pranav C R</h3>
            <p>Frontend Developer</p>
          </div>
          <div className="team-card">
            <div className="team-image"></div>
            <h3>Kesavan G</h3>
            <p>Backend Developer</p>
          </div>
          <div className="team-card">
            <div className="team-image"></div>
            <h3>Adwaith J</h3>
            <p>AIML Developer</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Your Message"></textarea>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </section>

      {/* Support Section */}
      <section id="support" className="support">
        <h2>Support</h2>
        <div className="support-grid">
          <div className="support-card">
            <h3>Documentation</h3>
            <p>Comprehensive guides and tutorials to help you get started.</p>
            <Link to="/docs" className="btn btn-secondary">View Docs</Link>
          </div>
          <div className="support-card">
            <h3>FAQ</h3>
            <p>Find answers to commonly asked questions.</p>
            <Link to="/faq" className="btn btn-secondary">View FAQ</Link>
          </div>
          <div className="support-card">
            <h3>Community</h3>
            <p>Join our community forum for discussions and support.</p>
            <Link to="/community" className="btn btn-secondary">Join Community</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Product</h4>
            <Link to="#features">Features</Link>
            <Link to="#pricing">Pricing</Link>
            <Link to="/docs">Documentation</Link>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <Link to="#team">About Us</Link>
            <Link to="#contact">Contact</Link>
            <Link to="/careers">Careers</Link>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <Link to="/blog">Blog</Link>
            <Link to="/community">Community</Link>
            <Link to="/support">Support</Link>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <Link to="https://twitter.com">Twitter</Link>
              <Link to="https://linkedin.com">LinkedIn</Link>
              <Link to="https://github.com">GitHub</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Serenity AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 