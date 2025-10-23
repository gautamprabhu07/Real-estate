// pin.jsx
import { Marker, Popup } from "react-leaflet";
import { 
  HiLocationMarker,
  HiHeart,
  HiExternalLink,
  HiCurrencyDollar,
  HiHome,
  HiCamera
} from "react-icons/hi";
import { IoBedOutline, IoWaterOutline, IoResizeOutline } from "react-icons/io5";
import { useState } from "react";
import "./pin.scss";
import { Link } from "react-router-dom";
import L from "leaflet";

function Pin({ item }) {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Custom marker icon
  const customIcon = new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin">
        <div class="marker-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
          </svg>
        </div>
        <div class="marker-price">$${(item.price / 1000).toFixed(0)}k</div>
      </div>
    `,
    iconSize: [60, 70],
    iconAnchor: [30, 70],
    popupAnchor: [0, -70]
  });

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <Marker position={[item.latitude, item.longitude]} icon={customIcon}>
      <Popup className="custom-popup" maxWidth={320} minWidth={280}>
        <div className="pin-popup">
          {/* Image Section */}
          <div className="pin-popup__image-wrapper">
            <Link to={`/${item.id}`} className="pin-popup__image-link">
              <img 
                src={imageError ? "/noimage.jpg" : (item.images?.[0] || "/noimage.jpg")} 
                alt={item.title}
                className="pin-popup__image"
                onError={() => setImageError(true)}
              />
              <div className="pin-popup__image-overlay"></div>
              
              {/* Image Count Badge */}
              {item.images && item.images.length > 1 && (
                <div className="pin-popup__image-count">
                  <HiCamera />
                  <span>{item.images.length}</span>
                </div>
              )}

              {/* View Details Button */}
              <div className="pin-popup__view-btn">
                <HiExternalLink />
                <span>View Details</span>
              </div>
            </Link>

            {/* Save Button */}
            <button 
              className={`pin-popup__save-btn ${isSaved ? "active" : ""}`}
              onClick={handleSave}
              aria-label="Save property"
            >
              <HiHeart />
            </button>

            {/* Property Type Badge */}
            <div className="pin-popup__type-badge">
              {item.type === "rent" ? "For Rent" : "For Sale"}
            </div>
          </div>

          {/* Content Section */}
          <div className="pin-popup__content">
            {/* Title */}
            <Link to={`/${item.id}`} className="pin-popup__title">
              <h3>{item.title}</h3>
            </Link>

            {/* Address */}
            <div className="pin-popup__address">
              <HiLocationMarker />
              <span>{item.address || "Location not specified"}</span>
            </div>

            {/* Property Stats */}
            <div className="pin-popup__stats">
              <div className="pin-popup__stat">
                <IoBedOutline />
                <span>{item.bedroom}</span>
              </div>
              <div className="pin-popup__stat-divider"></div>
              <div className="pin-popup__stat">
                <IoWaterOutline />
                <span>{item.bathroom || 2}</span>
              </div>
              <div className="pin-popup__stat-divider"></div>
              <div className="pin-popup__stat">
                <IoResizeOutline />
                <span>{item.size || "1,200"} sqft</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="pin-popup__footer">
              <div className="pin-popup__price">
                <HiCurrencyDollar className="pin-popup__price-icon" />
                <span className="pin-popup__price-amount">
                  ${item.price.toLocaleString()}
                </span>
                {item.type === "rent" && (
                  <span className="pin-popup__price-period">/mo</span>
                )}
              </div>
              <Link to={`/${item.id}`} className="pin-popup__cta">
                <span>View</span>
                <HiExternalLink />
              </Link>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;