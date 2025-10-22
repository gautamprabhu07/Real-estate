import { useState, useEffect, useRef, useContext, useMemo } from "react";
import "./navbar.scss";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import apiRequest from "../../lib/apiRequest";

// DiceBear avatar generator
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScroll = useRef(window.scrollY);
  const menuRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, updateUser } = useContext(AuthContext);
  const fetchNotifications = useNotificationStore((state) => state.fetch);
  const notificationNumber = useNotificationStore((state) => state.number);

  // Fetch user if not available
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!currentUser) {
          const res = await apiRequest.get("/auth/me");
          updateUser(res.data);
        }
      } catch {
        console.log("User not authenticated");
      }
    };
    fetchUser();
  }, [currentUser, updateUser]);

  // Fetch notification count if logged in
  useEffect(() => {
    if (currentUser) fetchNotifications();
  }, [currentUser, fetchNotifications]);

  // Scroll animation with background change
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll < 0) return;
      
      setIsScrolled(currentScroll > 50);
      setShowNavbar(currentScroll < lastScroll.current || currentScroll < 100);
      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Generate random DiceBear avatar if no custom avatar exists
  const generatedAvatar = useMemo(() => {
    if (!currentUser) return null;
    return createAvatar(bottts, {
      seed: currentUser.username || "user",
      size: 80,
      backgroundType: ["gradientLinear"],
      backgroundColor: ["b6e3f4", "c0aede", "d1f4a5"],
    }).toDataUri();
  }, [currentUser]);

  // Determine avatar source
  const userAvatarSrc = currentUser?.avatar || generatedAvatar;

  // Check if link is active
  const isActiveLink = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${showNavbar ? "navbar--visible" : "navbar--hidden"} ${isScrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        <div className="navbar__inner" ref={menuRef}>
          {/* Brand Section */}
          <div className="navbar__brand">
            <Link to="/" className="navbar__logo">
              <div className="navbar__logo-icon">
                <img src="/logo.png" alt="UrbanLuxe Logo" />
              </div>
              <div className="navbar__logo-text">
                <span className="navbar__logo-title">UrbanLuxe</span>
                <span className="navbar__logo-subtitle">BUILDING CO.</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className={`navbar__links ${menuOpen ? "navbar__links--active" : ""}`}>
            <Link 
              to="/" 
              className={isActiveLink("/") ? "navbar__link navbar__link--active" : "navbar__link"}
            >
              Home
            </Link>
            <Link 
              to="/listings" 
              className={isActiveLink("/listings") ? "navbar__link navbar__link--active" : "navbar__link"}
            >
              Listings
            </Link>
            <Link 
              to="/agents" 
              className={isActiveLink("/agents") ? "navbar__link navbar__link--active" : "navbar__link"}
            >
              Agents
            </Link>
            <Link 
              to="/about" 
              className={isActiveLink("/about") ? "navbar__link navbar__link--active" : "navbar__link"}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={isActiveLink("/contact") ? "navbar__link navbar__link--active" : "navbar__link"}
            >
              Contact
            </Link>

            {/* Mobile-only auth links */}
            {!currentUser && (
              <div className="navbar__mobile-auth">
                <Link to="/login" className="navbar__mobile-login">
                  Sign In
                </Link>
                <Link to="/register" className="navbar__mobile-register">
                  Create Account
                </Link>
              </div>
            )}
          </nav>

          {/* Auth or User Info (Desktop) */}
          <div className="navbar__actions">
            {currentUser ? (
              <div className="navbar__user">
                <Link to="/profile" className="navbar__user-profile">
                  <div className="navbar__user-avatar">
                    <img src={userAvatarSrc} alt="User Avatar" />
                    {notificationNumber > 0 && (
                      <div className="navbar__notification-badge">
                        {notificationNumber > 9 ? "9+" : notificationNumber}
                      </div>
                    )}
                  </div>
                  <div className="navbar__user-info">
                    <span className="navbar__user-name">{currentUser.username}</span>
                    <span className="navbar__user-label">My Profile</span>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="navbar__auth">
                <Link to="/login" className="navbar__auth-login">
                  Sign In
                </Link>
                <Link to="/register" className="navbar__auth-register">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="navbar__toggle"
            onClick={() => {
              if (!currentUser) setMenuOpen((prev) => !prev);
              else navigate("/profile");
            }}
            aria-label="Toggle Menu"
          >
            {!currentUser ? (
              menuOpen ? <IoClose /> : <TiThMenu />
            ) : (
              <div className="navbar__mobile-avatar-wrapper">
                <img
                  src={userAvatarSrc}
                  alt="Mobile User Avatar"
                  className="navbar__mobile-avatar"
                />
                {notificationNumber > 0 && (
                  <div className="navbar__notification-dot"></div>
                )}
              </div>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;