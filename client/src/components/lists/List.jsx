// list.jsx
import { useState, useEffect } from "react";
import { 
  HiViewGrid, 
  HiViewList,
  HiAdjustments,
  HiSortAscending,
  HiHome,
  HiEmojiSad,
  HiRefresh
} from "react-icons/hi";
import "./list.scss";
import Card from "../card/Card";

function List({ posts }) {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Simulate loading and trigger animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAnimateIn(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [posts]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Add sorting logic here
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const getSortedPosts = () => {
    if (!posts) return [];
    
    let sorted = [...posts];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "recent":
      default:
        return sorted;
    }
  };

  const sortedPosts = getSortedPosts();

  return (
    <section className={`list ${animateIn ? "list--animate" : ""}`}>
      {/* List Header */}
      <div className="list__header">
        <div className="list__header-left">
          <div className="list__header-icon">
            <HiHome />
          </div>
          <div className="list__header-info">
            <h2 className="list__title">
              {posts && posts.length > 0 ? "Available Properties" : "Properties"}
            </h2>
            <p className="list__count">
              {posts && posts.length > 0 ? (
                <>
                  <span className="list__count-number">{posts.length}</span>
                  <span className="list__count-label">
                    {posts.length === 1 ? "property" : "properties"} found
                  </span>
                </>
              ) : (
                <span className="list__count-label">No properties available</span>
              )}
            </p>
          </div>
        </div>

        {posts && posts.length > 0 && (
          <div className="list__header-right">
            {/* Sort Dropdown */}
            <div className="list__sort">
              <HiSortAscending className="list__sort-icon" />
              <select 
                value={sortBy} 
                onChange={handleSortChange}
                className="list__sort-select"
              >
                <option value="recent">Most Recent</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="list__view-toggle">
              <button
                className={`list__view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <HiViewGrid />
              </button>
              <button
                className={`list__view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <HiViewList />
              </button>
            </div>

            {/* Refresh Button */}
            <button 
              className="list__refresh-btn"
              onClick={handleRefresh}
              aria-label="Refresh"
            >
              <HiRefresh className={isLoading ? "spinning" : ""} />
            </button>
          </div>
        )}
      </div>

      {/* List Content */}
      {isLoading ? (
        <div className="list__loading">
          <div className="list__loading-spinner"></div>
          <p className="list__loading-text">Loading properties...</p>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className={`list__grid list__grid--${viewMode}`}>
          {sortedPosts.map((item, index) => (
            <div 
              key={item.id} 
              className="list__card-wrapper"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="list__empty">
          <div className="list__empty-icon">
            <HiEmojiSad />
          </div>
          <h3 className="list__empty-title">No Properties Found</h3>
          <p className="list__empty-text">
            We couldn't find any properties matching your criteria.
            <br />
            Try adjusting your filters or check back later.
          </p>
          <button className="list__empty-btn" onClick={handleRefresh}>
            <HiRefresh />
            <span>Refresh Results</span>
          </button>
        </div>
      )}

      {/* Results Summary Footer */}
      {posts && posts.length > 0 && (
        <div className="list__footer">
          <div className="list__footer-info">
            <HiAdjustments className="list__footer-icon" />
            <span>
              Showing <strong>{posts.length}</strong> of <strong>{posts.length}</strong> properties
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

export default List;