import { useState } from "react";
import "./search.scss";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";


const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
            {type}
          </button>
        ))}
      </div>
      <form className="searchBar__form">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={query.city}
          onChange={handleChange}
          aria-label="City"
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={query.minPrice}
          onChange={handleChange}
          min={0}
          aria-label="Minimum price"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={query.maxPrice}
          onChange={handleChange}
          min={0}
          aria-label="Maximum price"
        />
        <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          className="searchBar__submitLink"
        >
          <button type="button" aria-label="Search listings">
            <FaSearch />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
