import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.scss";
import Pin from "../pin/Pin";
import { useEffect, useState } from "react";

function FitBounds({ items }) {
  const map = useMap();

  useEffect(() => {
    if (!items || items.length === 0) return;

    // Filter items that have valid lat/lng
    const coords = items
      .map((it) => {
        const lat = parseFloat(it.latitude);
        const lng = parseFloat(it.longitude);
        return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
      })
      .filter(Boolean);

    if (coords.length === 0) return;

    if (coords.length === 1) {
      // single item: center and set a reasonable zoom
      map.setView(coords[0], 13, { animate: true });
    } else {
      // multiple items: fit to bounds with padding
      map.fitBounds(coords, { padding: [50, 50], animate: true });
    }
  }, [items, map]);

  return null;
}

function Map({ items }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Use first item's position as initial center when available
  const defaultPosition = items && items.length > 0 && items[0].latitude && items[0].longitude
    ? [parseFloat(items[0].latitude), parseFloat(items[0].longitude)]
    : [52.4797, -1.90269];

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`mapWrapper ${isLoaded ? 'loaded' : ''}`}>
      {/* Map Header */}
      <div className="mapHeader">
        <div className="mapHeaderContent">
          <div className="mapIcon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div className="mapTitle">
            <h3>Property Locations</h3>
            <p>{items.length} {items.length === 1 ? 'Property' : 'Properties'} Found</p>
          </div>
        </div>
        <div className="mapBadge">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span>Live</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="mapContainer">
        <MapContainer
          center={defaultPosition}
          zoom={7}
          scrollWheelZoom={false}
          zoomControl={false}     // changed: disable Leaflet's built-in zoom (+/-)
          className="map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Fit bounds / recenter whenever items change */}
          <FitBounds items={items} />

          {items.map((item) => (
            <Pin item={item} key={item.id} />
          ))}
        </MapContainer>

        {/* Map Controls Overlay */}
        <div className="mapControls">
          <button className="mapControlBtn" title="Zoom In">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button className="mapControlBtn" title="Zoom Out">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button className="mapControlBtn" title="Recenter">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>

        {/* Corner Decoration */}
        <div className="mapDecoration topLeft"></div>
        <div className="mapDecoration topRight"></div>
        <div className="mapDecoration bottomLeft"></div>
        <div className="mapDecoration bottomRight"></div>
      </div>

      {/* mapFooter removed per request */}
    </div>
  );
}

export default Map;