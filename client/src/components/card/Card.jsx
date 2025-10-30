import { Link, useNavigate } from "react-router-dom";
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
import { useState, useEffect, useRef } from "react";
import { savePost } from '../../lib/loaders';
import "./card.scss";


function Card({ item, viewMode, isSavedInitial = false }) {
  const [isSaved, setIsSaved] = useState(Boolean(isSavedInitial));
  const [imageError, setImageError] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();


  // keep local saved state in sync if parent provides updates
  useEffect(() => {
    setIsSaved(Boolean(isSavedInitial));
  }, [isSavedInitial]);


  // cleanup any pending timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);


  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // optimistic toggle + persist on server
    const prev = isSaved;
    setIsSaved(!prev);
    (async () => {
      try {
        await savePost(item.id);
      } catch (err) {
        // revert on error
        console.error('Failed to save post', err);
        setIsSaved(prev);
      }
    })();
  };


  const handleChat = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Navigating to chat for item ID:", item.id);
    navigate(`/${item.id}?openChat=true`);
  };


  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // copy link to clipboard (robust fallback)
    const shareUrl = (typeof window !== 'undefined') ? `${window.location.origin}/${item.id}` : item.id;


    const copyText = async (text) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      // fallback
      return new Promise((resolve, reject) => {
        try {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          const ok = document.execCommand('copy');
          document.body.removeChild(ta);
          if (ok) resolve(); else reject(new Error('copy failed'));
        } catch (err) {
          reject(err);
        }
      });
    };


    copyText(shareUrl)
      .then(() => {
        setShowCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setShowCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Copy failed', err);
      });
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
          {showCopied && (
            <div
              className="card__share-toast"
              role="status"
              aria-live="polite"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'rgba(0,0,0,0.85)',
                color: '#fff',
                padding: '6px 8px',
                borderRadius: 6,
                fontSize: 12,
                zIndex: 60,
              }}
            >
              Link copied
            </div>
          )}
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
            <span className="card__stat-value">{item.sqft ?? item.postDetail?.size ?? "—"}</span>
            <span className="card__stat-label">sqft</span>
          </div>
        </div>


        {/* Footer */}
        <div className="card__footer">
          <div className="card__posted">
            <HiClock className="card__posted-icon" />
            <span>{postedLabel}</span>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Card;
