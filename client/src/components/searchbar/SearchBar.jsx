import { useState } from "react";
import "./search.scss";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import { HiHome, HiKey } from "react-icons/hi";

const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  const [isFocused, setIsFocused] = useState({
    city: false,
    minPrice: false,
    maxPrice: false,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="searchBar">
      <div className="searchBar__types">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
            type="button"
            aria-pressed={query.type === type}
          >
            {type === "buy" ? <HiHome /> : <HiKey />}
            <span>{type}</span>
          </button>
        ))}
      </div>
      <form className="searchBar__form">
        <div className={`searchBar__inputGroup ${isFocused.city ? "focused" : ""}`}>
          <FaMapMarkerAlt className="searchBar__icon" />
          <input
            type="text"
            name="city"
            placeholder="City Location"
            value={query.city}
            onChange={handleChange}
            onFocus={() => handleFocus("city")}
            onBlur={() => handleBlur("city")}
            aria-label="City"
          />
        </div>
        <div className={`searchBar__inputGroup ${isFocused.minPrice ? "focused" : ""}`}>
          <FaDollarSign className="searchBar__icon" />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={query.minPrice}
            onChange={handleChange}
            onFocus={() => handleFocus("minPrice")}
            onBlur={() => handleBlur("minPrice")}
            min={0}
            aria-label="Minimum price"
          />
        </div>
        <div className={`searchBar__inputGroup ${isFocused.maxPrice ? "focused" : ""}`}>
          <FaDollarSign className="searchBar__icon" />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={query.maxPrice}
            onChange={handleChange}
            onFocus={() => handleFocus("maxPrice")}
            onBlur={() => handleBlur("maxPrice")}
            min={0}
            aria-label="Maximum price"
          />
        </div>
        <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          className="searchBar__submitLink"
        >
          <button type="button" aria-label="Search listings">
            <FaSearch />
            <span>Search</span>
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;