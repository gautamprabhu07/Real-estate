import { useEffect, useRef } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homepage.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const floatingRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate floating elements on scroll
    const handleScroll = () => {
      const scrolled = window.scrollY;
      floatingRef.current.forEach((el, index) => {
        if (el) {
          const speed = 0.5 + index * 0.1;
          el.style.transform = `translateY(${scrolled * speed}px)`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCardClick = () => {
    console.log("Card clicked, navigating to: /68ff7a0dd9136a34a7b7c41f");
    navigate("/68ff7a0dd9136a34a7b7c41f");
  };

  return (
    <section className="homepage">
      {/* Animated Background Elements */}
      <div className="homepage__background">
        <div className="homepage__shape homepage__shape--1"></div>
        <div className="homepage__shape homepage__shape--2"></div>
        <div className="homepage__shape homepage__shape--3"></div>
        <div className="homepage__floating-icon homepage__floating-icon--1" ref={el => floatingRef.current[0] = el}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="homepage__floating-icon homepage__floating-icon--2" ref={el => floatingRef.current[1] = el}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="homepage__floating-icon homepage__floating-icon--3" ref={el => floatingRef.current[2] = el}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="homepage__container">
        <div className="homepage__content">
          <div className="homepage__wrapper">
            {/* Badge */}
            <div className="homepage__badge">
              <span className="homepage__badge-icon">🏆</span>
              <span className="homepage__badge-text">Trusted by 10,000+ Happy Clients</span>
            </div>

            {/* Main Heading */}
            <h1 className="homepage__title">
              Discover Your
              <span className="homepage__title-highlight"> Perfect Home</span>
              <br />
              With Confidence
            </h1>

            {/* Subtitle */}
            <p className="homepage__subtitle">
              Explore premium properties across the city. From luxury apartments to cozy homes, 
              we help you find the perfect space that matches your lifestyle and budget.
            </p>

            {/* Search Bar */}
            <div className="homepage__search">
              <SearchBar />
            </div>

            {/* Stats Section */}
            <div className="homepage__stats">
              <div className="homepage__stat-item">
                <div className="homepage__stat-number">16+</div>
                <div className="homepage__stat-label">Years Experience</div>
              </div>
              <div className="homepage__stat-divider"></div>
              <div className="homepage__stat-item">
                <div className="homepage__stat-number">200+</div>
                <div className="homepage__stat-label">Awards Won</div>
              </div>
              <div className="homepage__stat-divider"></div>
              <div className="homepage__stat-item">
                <div className="homepage__stat-number">2,000+</div>
                <div className="homepage__stat-label">Properties Listed</div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="homepage__trust">
              <div className="homepage__trust-item">
                <svg className="homepage__trust-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Verified Properties</span>
              </div>
              <div className="homepage__trust-item">
                <svg className="homepage__trust-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>24/7 Support</span>
              </div>
              <div className="homepage__trust-item">
                <svg className="homepage__trust-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Best Rated Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image Section */}
        <aside className="homepage__visual" aria-hidden="true">
          <div className="homepage__image-wrapper">
            <div className="homepage__image-card homepage__image-card--main">
              <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=900&fit=crop" 
                alt="Modern luxury home exterior" 
                loading="eager"
              />
              <div className="homepage__image-overlay">
                <Link to="/list?sort=featured" className="homepage__image-badge-link">
                  <div className="homepage__image-badge">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Featured</span>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="homepage__image-card homepage__image-card--small">
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=500&fit=crop" 
                alt="Luxury apartment interior" 
                loading="lazy"
              />
            </div>

            {/* Floating Info Card - FIXED */}
            <div 
              className="homepage__floating-card" 
              onClick={handleCardClick}
              style={{ cursor: 'pointer' }}
            >
              <div className="homepage__floating-card-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="homepage__floating-card-content">
                <div className="homepage__floating-card-title">New Listing</div>
                <div className="homepage__floating-card-subtitle">Modern Villa Available</div>
              </div>
              <div className="homepage__floating-card-pulse"></div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default HomePage;