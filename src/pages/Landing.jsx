import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
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
      if (isMenuOpen) {
        setIsMenuOpen(false); // Close mobile menu after clicking
      }
    }
  };

  // Scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optional: Unobserve after animation if you only want it once
            // observer.unobserve(entry.target);
          } else {
            // Optional: Remove class if you want animation to repeat on scroll out/in
            // entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        // rootMargin: "-50px 0px -50px 0px" // Adjust viewport bounds
      }
    );

    const elementsToAnimate = document.querySelectorAll('[data-scroll-animate]');
    elementsToAnimate.forEach((el) => observer.observe(el));

    return () => {
      elementsToAnimate.forEach((el) => observer.unobserve(el));
    };
  }, []);


  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <Logo size={32} className="logo-icon" />
            <span>Serenity AI</span>
          </Link>
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

        <button className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isMenuOpen}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-logo" data-scroll-animate data-animation-delay="0s">
            <Logo size={80} className="logo-icon" />
          </div>
          <h1 data-scroll-animate data-animation-delay="0.2s">Welcome to Serenity AI</h1>
          <p data-scroll-animate data-animation-delay="0.4s">Your personal AI companion for a more peaceful and productive life.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary" data-scroll-animate data-animation-delay="0.6s">Get Started</Link>
            <a href="#features" className="btn btn-secondary" onClick={(e) => scrollToSection(e, 'features')} data-scroll-animate data-animation-delay="0.7s">Learn More</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features section-padding">
        <h2 data-scroll-animate>Features</h2>
        <div className="features-grid">
          <div className="feature-card" data-scroll-animate data-animation-delay="0s">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Assistance</h3>
            <p>Get intelligent help with your daily tasks and decision-making.</p>
          </div>
          <div className="feature-card" data-scroll-animate data-animation-delay="0.1s">
            <div className="feature-icon">🎯</div>
            <h3>Personalized Experience</h3>
            <p>Tailored recommendations and insights based on your preferences.</p>
          </div>
          <div className="feature-card" data-scroll-animate data-animation-delay="0.2s">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is protected with enterprise-grade security.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing section-padding">
        <h2 data-scroll-animate>Pricing Plans</h2>
        <div className="pricing-grid">
          <div className="pricing-card" data-scroll-animate data-animation-delay="0s">
            <h3>Basic</h3>
            <div className="price">$9<span>/month</span></div>
            <ul>
              <li>Basic AI assistance</li>
              <li>5 tasks per day</li>
              <li>Email support</li>
            </ul>
            <Link to="/signup" className="btn btn-primary">Choose Plan</Link>
          </div>
          <div className="pricing-card featured" data-scroll-animate data-animation-delay="0.1s">
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
          <div className="pricing-card" data-scroll-animate data-animation-delay="0.2s">
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
      <section id="team" className="team section-padding">
        <h2 data-scroll-animate>Our Team</h2>
        <div className="team-grid">
          <div className="team-card" data-scroll-animate data-animation-delay="0s">
            <div className="team-image-wrapper">
              <img src="/pfp.jpg" alt="Pranav C R" className="team-image" />
            </div>
            <h3>Pranav C R</h3>
            <p>Frontend Developer</p>
          </div>
          <div className="team-card" data-scroll-animate data-animation-delay="0.1s">
            <div className="team-image-wrapper">
              <img src="/pfp.jpg" alt="Kesavan G" className="team-image" />
            </div>
            <h3>Kesavan G</h3>
            <p>Backend Developer</p>
          </div>
          <div className="team-card" data-scroll-animate data-animation-delay="0.2s">
            <div className="team-image-wrapper">
              <img src="/pfp.jpg" alt="Adwaith J" className="team-image" />
            </div>
            <h3>Adwaith J</h3>
            <p>AIML Developer</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact section-padding">
        <h2 data-scroll-animate>Contact Us</h2>
        <form className="contact-form" data-scroll-animate>
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Your Message"></textarea>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </section>

      {/* Support Section */}
      <section id="support" className="support section-padding">
        <h2 data-scroll-animate>Support</h2>
        <div className="support-grid">
          <div className="support-card" data-scroll-animate data-animation-delay="0s">
            <h3>Documentation</h3>
            <p>Comprehensive guides and tutorials to help you get started.</p>
            <Link to="/docs" className="btn btn-secondary">View Docs</Link>
          </div>
          <div className="support-card" data-scroll-animate data-animation-delay="0.1s">
            <h3>FAQ</h3>
            <p>Find answers to commonly asked questions.</p>
            <Link to="/faq" className="btn btn-secondary">View FAQ</Link>
          </div>
          <div className="support-card" data-scroll-animate data-animation-delay="0.2s">
            <h3>Community</h3>
            <p>Join our community forum for discussions and support.</p>
            <Link to="/community" className="btn btn-secondary">Join Community</Link>
          </div>
        </div>
      </section>

      {/* Signature */}
      <div className="de4dscope-signature">
        <span>with love, <b>TEAM DE4DSCOPE</b></span>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')}>Features</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')}>Pricing</a>
            <Link to="/docs">Documentation</Link>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#team" onClick={(e) => scrollToSection(e, 'team')}>About Us</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a>
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
              <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</Link>
              <Link to="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
              <Link to="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Serenity AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;