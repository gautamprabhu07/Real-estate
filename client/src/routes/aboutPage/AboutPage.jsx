import "./about.scss";
import { HiHome, HiUserGroup, HiShieldCheck, HiStar, HiLocationMarker, HiTrendingUp } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function AboutPage() {
  const [isVisible, setIsVisible] = useState({});
  const observerRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.dataset.section]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="aboutWrapper">
      {/* Hero Section */}
      <section className="aboutHero">
        <div className="aboutHero__background">
          <div className="aboutHero__overlay"></div>
        </div>
        <div className="aboutHero__content" data-section="hero" ref={(el) => (observerRefs.current[0] = el)}>
          <div className={`aboutHero__badge ${isVisible.hero ? 'animate' : ''}`}>
            <HiStar className="badge-icon" />
            <span>Trusted by 50,000+ Clients</span>
          </div>
          <h1 className={isVisible.hero ? 'animate' : ''}>
            <span className="gradient-text">Welcome to Building CO.</span>
          </h1>
          <p className={isVisible.hero ? 'animate' : ''}>
            Disclaimer: Numbers may be rounded, estimates may be estimated, and claims may be... well, let's just say 'creative'.
          </p>
          <div className={`aboutHero__ctas ${isVisible.hero ? 'animate' : ''}`}>
            <Link to="/list" className="aboutHero__cta primary">
              <span>Explore Properties</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/add" className="aboutHero__cta secondary">
              <HiLocationMarker />
              <span>Add property</span>
            </Link>
          </div>
          <div className={`aboutHero__stats ${isVisible.hero ? 'animate' : ''}`}>
            <div className="quick-stat">
              <span className="stat-value">1,200+</span>
              <span className="stat-label">Properties</span>
            </div>
            <div className="divider"></div>
            <div className="quick-stat">
              <span className="stat-value">4.9★</span>
              <span className="stat-label">Rating</span>
            </div>
            <div className="divider"></div>
            <div className="quick-stat">
              <span className="stat-value">10 Yrs</span>
              <span className="stat-label">Experience</span>
            </div>
          </div>
        </div>
        <div className="aboutHero__visual">
          <div className="floating-card card-1">
            <HiHome />
            <div>
              <span className="card-title">Premium Listings</span>
              <span className="card-subtitle">Verified Properties</span>
            </div>
          </div>
          <div className="floating-card card-2">
            <HiTrendingUp />
            <div>
              <span className="card-title">Market Growth</span>
              <span className="card-subtitle">+28% This Year</span>
            </div>
          </div>
          <div className="hero-image-container">
            <img src="/about-hero.jpg" alt="Luxury real estate showcase" />
            <div className="image-overlay"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="aboutFeatures" data-section="features" ref={(el) => (observerRefs.current[1] = el)}>
        <div className="section-header">
          <span className="section-label">Our Advantages</span>
          <h2>Why Choose Building CO?</h2>
          <p className="section-subtitle">Experience excellence in every interaction</p>
        </div>
        <div className={`aboutFeatures__grid ${isVisible.features ? 'animate' : ''}`}>
          <div className="featureCard">
            <div className="featureCard__icon">
              <HiHome className="featureIcon"/>
              <div className="icon-bg"></div>
            </div>
            <h3>Extensive Portfolio</h3>
            <p>Access over 1,200 verified listings spanning luxury apartments, family homes, commercial spaces, and investment properties in prime locations.</p>
            <div className="feature-decoration"></div>
          </div>
          <div className="featureCard delay-1">
            <div className="featureCard__icon">
              <HiUserGroup className="featureIcon"/>
              <div className="icon-bg"></div>
            </div>
            <h3>Expert Guidance</h3>
            <p>Our team of 30+ certified agents brings decades of local market expertise, ensuring you make informed decisions every step of the way.</p>
            <div className="feature-decoration"></div>
          </div>
          <div className="featureCard delay-2">
            <div className="featureCard__icon">
              <HiShieldCheck className="featureIcon"/>
              <div className="icon-bg"></div>
            </div>
            <h3>Secure Transactions</h3>
            <p>Industry-leading security protocols, verified listings, and transparent processes protect your investment and personal information.</p>
            <div className="feature-decoration"></div>
          </div>
          <div className="featureCard delay-3">
            <div className="featureCard__icon">
              <HiStar className="featureIcon"/>
              <div className="icon-bg"></div>
            </div>
            <h3>Proven Excellence</h3>
            <p>With a 4.9/5 rating from 50,000+ satisfied clients, our track record speaks volumes about our commitment to your success.</p>
            <div className="feature-decoration"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="aboutStats" data-section="stats" ref={(el) => (observerRefs.current[2] = el)}>
        <div className="aboutStats__container">
          <div className={`statCard ${isVisible.stats ? 'animate' : ''}`}>
            <div className="stat-icon">
              <HiHome />
            </div>
            <span className="statNumber" data-target="1200">0</span>
            <span className="statLabel">Properties Listed</span>
            <div className="stat-trend">
              <HiTrendingUp />
              <span>+15% this month</span>
            </div>
          </div>
          <div className={`statCard ${isVisible.stats ? 'animate delay-1' : ''}`}>
            <div className="stat-icon">
              <HiUserGroup />
            </div>
            <span className="statNumber" data-target="50000">0</span>
            <span className="statLabel">Happy Clients</span>
            <div className="stat-trend">
              <HiTrendingUp />
              <span>Growing daily</span>
            </div>
          </div>
          <div className={`statCard ${isVisible.stats ? 'animate delay-2' : ''}`}>
            <div className="stat-icon">
              <HiShieldCheck />
            </div>
            <span className="statNumber" data-target="30">0</span>
            <span className="statLabel">Certified Agents</span>
            <div className="stat-trend">
              <HiStar />
              <span>Expert team</span>
            </div>
          </div>
          <div className={`statCard ${isVisible.stats ? 'animate delay-3' : ''}`}>
            <div className="stat-icon">
              <HiStar />
            </div>
            <span className="statNumber" data-target="10">0</span>
            <span className="statLabel">Years Excellence</span>
            <div className="stat-trend">
              <HiShieldCheck />
              <span>Trusted brand</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="aboutMission" data-section="mission" ref={(el) => (observerRefs.current[3] = el)}>
        <div className="aboutMission__content">
          <div className={`mission-icon ${isVisible.mission ? 'animate' : ''}`}>
            <HiHome />
          </div>
          <h2 className={isVisible.mission ? 'animate' : ''}>Our Mission</h2>
          <p className={isVisible.mission ? 'animate' : ''}>
            To revolutionize the real estate experience by combining cutting-edge technology with personalized service. 
            We empower every client—from first-time buyers to seasoned investors—with the tools, insights, and support 
            needed to make confident property decisions that shape their future.
          </p>
          <div className={`aboutActions ${isVisible.mission ? 'animate' : ''}`}>
            <Link to="/list" className="aboutActionBtn">
              <span>Start Your Journey</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/contact" className="aboutSecondaryBtn">
              <span>Schedule Consultation</span>
            </Link>
          </div>
        </div>
        <div className="aboutMission__decoration">
          <div className="deco-circle circle-1"></div>
          <div className="deco-circle circle-2"></div>
          <div className="deco-circle circle-3"></div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;