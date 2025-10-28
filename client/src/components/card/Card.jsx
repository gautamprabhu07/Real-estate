// card.jsx
import { Link } from "react-router-dom";
import { 
  HiLocationMarker, 
  HiBadgeCheck, 
  HiHeart,
  HiChat,
  HiCamera,
  HiTrendingUp,
  HiClock
} from "react-icons/hi";
import { 
  IoBedOutline, 
  IoWaterOutline,
  IoResizeOutline,
  IoShareSocialOutline
} from "react-icons/io5";
import { useState } from "react";
import "./card.scss";

function Card({ item, viewMode }) {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleChat = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle chat logic
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle share logic
  };

  // compute "time ago" based on createdAt (falls back to postedTime if not present)
  const getPostedTime = (iso) => {
    if (!iso) return null;
    const diffMs = Date.now() - new Date(iso).getTime();
    if (diffMs < 0) return "just now";

    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

    const hours = Math.floor(diffMs / 3600000);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

    const days = Math.floor(diffMs / 86400000);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const postedLabel = item.createdAt ? getPostedTime(item.createdAt) : (item.postedTime || "2 days ago");

  // Determine property type badge
  const getPropertyBadge = () => {
    if (item.type === "rent") return { label: "For Rent", class: "rent" };
    if (item.type === "buy") return { label: "For Sale", class: "sale" };
    return { label: "Featured", class: "featured" };
  };

  const badge = getPropertyBadge();

  return (
    <div className={`card ${viewMode === 'list' ? 'card--list' : ''}`}>
      <Link to={`/${item.id}`} className="card__image-wrapper">
        {/* Property Badge */}
        <div className={`card__badge card__badge--${badge.class}`}>
          <HiBadgeCheck className="card__badge-icon" />
          <span>{badge.label}</span>
        </div>

        {/* Image Count Badge */}
        {item.images && item.images.length > 1 && (
          <div className="card__image-count">
            <HiCamera />
            <span>{item.images.length}</span>
          </div>
        )}

        {/* Property Image */}
        <div className="card__image">
          <img 
            src={imageError ? "/noimage.jpg" : (item.images?.[0] || "/noimage.jpg")} 
            alt={item.title}
            onError={() => setImageError(true)}
          />
          <div className="card__image-overlay"></div>
        </div>

        {/* Quick Actions Overlay */}
        <div className="card__quick-actions">
          <button 
            className={`card__action-btn card__action-btn--save ${isSaved ? "active" : ""}`}
            onClick={handleSave}
            aria-label="Save property"
          >
            <HiHeart />
          </button>
          <button 
            className="card__action-btn card__action-btn--share"
            onClick={handleShare}
            aria-label="Share property"
          >
            <IoShareSocialOutline />
          </button>
        </div>
      </Link>

      <div className="card__content">
        {/* Price Section */}
        <div className="card__price-section">
          <div className="card__price">
            <span className="card__price-amount">${item.price.toLocaleString()}</span>
            {item.type === "rent" && <span className="card__price-period">/month</span>}
          </div>
          {item.trending && (
            <div className="card__trending">
              <HiTrendingUp />
              <span>Hot</span>
            </div>
          )}
        </div>

        {/* Title */}
        <Link to={`/${item.id}`} className="card__title">
          <h3>{item.title}</h3>
        </Link>

        {/* Address */}
        <div className="card__address">
          <HiLocationMarker className="card__address-icon" />
          <span>{item.address}</span>
        </div>

        {/* Property Stats */}
        <div className="card__stats">
          <div className="card__stat">
            <IoBedOutline className="card__stat-icon" />
            <span className="card__stat-value">{item.bedroom}</span>
            <span className="card__stat-label">Beds</span>
          </div>
          <div className="card__stat-divider"></div>
          <div className="card__stat">
            <IoWaterOutline className="card__stat-icon" />
            <span className="card__stat-value">{item.bathroom}</span>
            <span className="card__stat-label">Baths</span>
          </div>
          <div className="card__stat-divider"></div>
          <div className="card__stat">
            <IoResizeOutline className="card__stat-icon" />
            <span className="card__stat-value">{item.size || "1,200"}</span>
            <span className="card__stat-label">sqft</span>
          </div>
        </div>

        {/* Footer */}
        <div className="card__footer">
          <div className="card__posted">
            <HiClock className="card__posted-icon" />
            <span>{postedLabel}</span>
          </div>
          <button 
            className="card__chat-btn"
            onClick={handleChat}
          >
            <HiChat />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;