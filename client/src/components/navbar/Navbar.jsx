import { useState, useEffect, useRef, useContext, useMemo } from "react";
import "./navbar.scss";
import { TiThMenu } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import apiRequest from "../../lib/apiRequest";

// DiceBear avatar generator
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScroll = useRef(window.scrollY);
  const menuRef = useRef();
  const navigate = useNavigate();

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

  // Scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll < 0) return;
      setShowNavbar(currentScroll < lastScroll.current);
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

  return (
    <nav className={`navbar ${showNavbar ? "navbar--visible" : "navbar--hidden"}`}>
      <div className="navbar__inner" ref={menuRef}>
        {/* Brand Section */}
        <div className="navbar__brand">
          <Link to="/" className="navbar__logo">
            <img src="/logo.png" alt="UrbanLuxe Logo" />
            <span>BUILDING CO.</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className={`navbar__links ${menuOpen ? "active" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/listings">Listings</Link>
          <Link to="/agents">Agents</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Auth or User Info (Desktop) */}
        <div className="navbar__actions">
          {currentUser ? (
            <div className="navbar__user">
              <img src={userAvatarSrc} alt="User Avatar" />
              <span>{currentUser.username}</span>
              <div className="navbar__profile">
                <Link to="/profile" className="profile-link">
                  Profile
                </Link>
                {notificationNumber > 0 && (
                  <div className="navbar__notification">{notificationNumber}</div>
                )}
                
              </div>
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="login">Sign In</Link>
              <Link to="/register" className="register">Join</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle — Avatar if logged in, menu if not */}
        <button
          className="navbar__toggle"
          onClick={() => {
            if (!currentUser) setMenuOpen((prev) => !prev);
            else navigate("/profile");
          }}
          aria-label="Toggle Menu"
        >
          {!currentUser ? (
            <TiThMenu />
          ) : (
            <img
              src={userAvatarSrc}
              alt="Mobile User Avatar"
              className="navbar__mobile-avatar"
            />
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
