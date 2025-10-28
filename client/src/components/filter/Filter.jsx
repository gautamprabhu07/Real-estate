// filter.jsx
import { useState, useEffect, useRef } from "react";
import { 
  HiLocationMarker, 
  HiHome,
  HiCurrencyDollar,
  HiSearch,
  HiFilter,
  HiX,
  HiAdjustments,
  HiChevronDown,
  HiCheckCircle,
  HiRefresh
} from "react-icons/hi";
import { IoBedOutline } from "react-icons/io5";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [openSelect, setOpenSelect] = useState(null); // 'type' | 'property' | null
  const wrapperRef = useRef(null);

  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  // Count active filters
  useEffect(() => {
    const count = Object.values(query).filter(val => val !== "").length;
    setActiveFilters(count);
  }, [query]);

  // click outside to close custom selects
  useEffect(() => {
    const onDoc = (e) => {
      if (openSelect && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenSelect(null);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openSelect]);

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  const handleReset = () => {
    const emptyQuery = {
      type: "",
      city: "",
      property: "",
      minPrice: "",
      maxPrice: "",
      bedroom: "",
    };
    setQuery(emptyQuery);
    setSearchParams({});
  };

  const hasActiveFilters = activeFilters > 0;
  const cityName = searchParams.get("city") || "All Locations";

  return (
    <div className={`filter ${isExpanded ? "filter--expanded" : ""}`} ref={wrapperRef}>
      {/* Header */}
      <div className="filter__header">
        <div className="filter__title-section">
          <div className="filter__icon">
            <HiSearch />
          </div>
          <div className="filter__title-content">
            <h1 className="filter__title">
              Search Results
            </h1>
            <p className="filter__subtitle">
              <HiLocationMarker className="filter__location-icon" />
              <span>Showing properties in <strong>{cityName}</strong></span>
            </p>
          </div>
        </div>

        <div className="filter__header-actions">
          {hasActiveFilters && (
            <button 
              className="filter__reset-btn"
              onClick={handleReset}
              title="Clear all filters"
            >
              <HiRefresh />
              <span>Reset</span>
            </button>
          )}
          <button 
            className={`filter__toggle ${isExpanded ? "active" : ""}`}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Toggle filters"
          >
            <HiFilter />
            <span className="filter__toggle-text">Filters</span>
            {activeFilters > 0 && (
              <span className="filter__count-badge">{activeFilters}</span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Form */}
      <div className="filter__form">
        {/* Primary Search */}
        <div className="filter__primary">
          <div className="filter__field filter__field--full">
            <label htmlFor="city" className="filter__label">
              <HiLocationMarker />
              <span>Location</span>
            </label>
            <div className="filter__input-wrapper">
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Enter city, neighborhood, or ZIP code"
                onChange={handleChange}
                value={query.city}
                className="filter__input"
              />
              {query.city && (
                <button 
                  className="filter__clear-btn"
                  onClick={() => setQuery({...query, city: ""})}
                  aria-label="Clear location"
                >
                  <HiX />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="filter__advanced">
          <div className="filter__grid">
            {/* Type (custom dropdown) */}
            <div className="filter__field">
              <label htmlFor="type" className="filter__label">
                <HiAdjustments />
                <span>Listing Type</span>
              </label>

              <div className="filter__custom-select">
                <button
                  type="button"
                  className={`filter__custom-btn ${openSelect === "type" ? "open" : ""}`}
                  onClick={() => setOpenSelect(openSelect === "type" ? null : "type")}
                  aria-haspopup="listbox"
                  aria-expanded={openSelect === "type"}
                >
                  <span className="filter__custom-value">
                    {query.type ? (query.type === "buy" ? "For Sale" : "For Rent") : "Any Type"}
                  </span>
                  <HiChevronDown className="filter__select-icon" />
                </button>

                <ul
                  role="listbox"
                  tabIndex="-1"
                  className={`filter__options ${openSelect === "type" ? "open" : ""}`}
                >
                  <li className={`filter__option ${query.type === "" ? "selected" : ""}`} onClick={() => { setQuery({...query, type: ""}); setOpenSelect(null); }}>
                    Any Type
                  </li>
                  <li className={`filter__option ${query.type === "buy" ? "selected" : ""}`} onClick={() => { setQuery({...query, type: "buy"}); setOpenSelect(null); }}>
                    For Sale
                  </li>
                  <li className={`filter__option ${query.type === "rent" ? "selected" : ""}`} onClick={() => { setQuery({...query, type: "rent"}); setOpenSelect(null); }}>
                    For Rent
                  </li>
                </ul>
              </div>
            </div>

            {/* Property Type (custom dropdown) */}
            <div className="filter__field">
              <label htmlFor="property" className="filter__label">
                <HiHome />
                <span>Property Type</span>
              </label>

              <div className="filter__custom-select">
                <button
                  type="button"
                  className={`filter__custom-btn ${openSelect === "property" ? "open" : ""}`}
                  onClick={() => setOpenSelect(openSelect === "property" ? null : "property")}
                  aria-haspopup="listbox"
                  aria-expanded={openSelect === "property"}
                >
                  <span className="filter__custom-value">
                    {query.property ? query.property.charAt(0).toUpperCase() + query.property.slice(1) : "Any Property"}
                  </span>
                  <HiChevronDown className="filter__select-icon" />
                </button>

                <ul
                  role="listbox"
                  tabIndex="-1"
                  className={`filter__options ${openSelect === "property" ? "open" : ""}`}
                >
                  {["", "apartment", "house", "condo", "land", "villa", "townhouse"].map((p) => (
                    <li
                      key={p || "any"}
                      className={`filter__option ${query.property === p ? "selected" : ""}`}
                      onClick={() => { setQuery({...query, property: p}); setOpenSelect(null); }}
                    >
                      {p ? (p.charAt(0).toUpperCase() + p.slice(1)) : "Any Property"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Min Price */}
            <div className="filter__field">
              <label htmlFor="minPrice" className="filter__label">
                <HiCurrencyDollar />
                <span>Min Price</span>
              </label>
              <div className="filter__input-wrapper">
                <span className="filter__input-prefix">$</span>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  placeholder="No min"
                  onChange={handleChange}
                  value={query.minPrice}
                  min="0"
                  className="filter__input filter__input--number"
                />
              </div>
            </div>

            {/* Max Price */}
            <div className="filter__field">
              <label htmlFor="maxPrice" className="filter__label">
                <HiCurrencyDollar />
                <span>Max Price</span>
              </label>
              <div className="filter__input-wrapper">
                <span className="filter__input-prefix">$</span>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  placeholder="No max"
                  onChange={handleChange}
                  value={query.maxPrice}
                  min="0"
                  className="filter__input filter__input--number"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div className="filter__field">
              <label htmlFor="bedroom" className="filter__label">
                <IoBedOutline />
                <span>Bedrooms</span>
              </label>
              <div className="filter__input-wrapper">
                <input
                  type="number"
                  id="bedroom"
                  name="bedroom"
                  placeholder="Any"
                  onChange={handleChange}
                  value={query.bedroom}
                  min="0"
                  className="filter__input filter__input--number"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="filter__field filter__field--button">
              <button 
                className="filter__search-btn" 
                onClick={handleFilter}
                aria-label="Search properties"
              >
                <HiSearch />
                <span>Search Properties</span>
                <div className="filter__search-shine"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="filter__summary">
            <div className="filter__summary-header">
              <HiCheckCircle />
              <span>Active Filters ({activeFilters})</span>
            </div>
            <div className="filter__tags">
              {query.city && (
                <div className="filter__tag">
                  <span>{query.city}</span>
                  <button onClick={() => setQuery({...query, city: ""})}>
                    <HiX />
                  </button>
                </div>
              )}
              {query.type && (
                <div className="filter__tag">
                  <span>{query.type === "buy" ? "For Sale" : "For Rent"}</span>
                  <button onClick={() => setQuery({...query, type: ""})}>
                    <HiX />
                  </button>
                </div>
              )}
              {query.property && (
                <div className="filter__tag">
                  <span>{query.property}</span>
                  <button onClick={() => setQuery({...query, property: ""})}>
                    <HiX />
                  </button>
                </div>
              )}
              {query.minPrice && (
                <div className="filter__tag">
                  <span>Min: ${parseInt(query.minPrice).toLocaleString()}</span>
                  <button onClick={() => setQuery({...query, minPrice: ""})}>
                    <HiX />
                  </button>
                </div>
              )}
              {query.maxPrice && (
                <div className="filter__tag">
                  <span>Max: ${parseInt(query.maxPrice).toLocaleString()}</span>
                  <button onClick={() => setQuery({...query, maxPrice: ""})}>
                    <HiX />
                  </button>
                </div>
              )}
              {query.bedroom && (
                <div className="filter__tag">
                  <span>{query.bedroom} Beds</span>
                  <button onClick={() => setQuery({...query, bedroom: ""})}>
                    <HiX />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Filter;