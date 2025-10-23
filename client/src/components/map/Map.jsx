import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.scss";
import Pin from "../pin/Pin";
import { useEffect, useState } from "react";

function Map({ items }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const position =
    items.length === 1 ? [items[0].latitude, items[0].longitude] : [52.4797, -1.90269];

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
          center={position}
          zoom={7}
          scrollWheelZoom={false}
          className="map"
          whenCreated={(map) => {
            // Fit bounds if multiple markers present
            if (items.length > 1) {
              const bounds = items.map((item) => [item.latitude, item.longitude]);
              map.fitBounds(bounds, { padding: [50, 50] });
            }
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
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

      {/* Map Footer Stats */}
      <div className="mapFooter">
        <div className="mapStat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Properties</span>
        </div>
        <div className="mapStat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          <span>Interactive Map</span>
        </div>
        <div className="mapStat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span>Updated</span>
        </div>
      </div>
    </div>
  );
}

export default Map;