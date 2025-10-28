import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense, useState, useEffect, useRef } from "react";

function ListPage() {
  const data = useLoaderData();
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
  ];

  const handleSelect = (value) => {
    setSortBy(value);
    setSortOpen(false);
  };

  // close dropdown on outside click or Escape
  useEffect(() => {
    function onDoc(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setSortOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`listPage ${isLoaded ? 'loaded' : ''}`}>
      {/* Hero Section */}
      <div className="listHero">
        <div className="heroContent">
          <div className="heroText">
            <div className="heroIcon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div>
              <h1>Find Your Dream Home</h1>
              <p>Explore premium properties tailored to your lifestyle</p>
            </div>
          </div>
          <div className="heroStats">
            <div className="stat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              <div>
                <span className="statNumber">2,500+</span>
                <span className="statLabel">Properties</span>
              </div>
            </div>
            <div className="stat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <div>
                <span className="statNumber">15K+</span>
                <span className="statLabel">Happy Clients</span>
              </div>
            </div>
            <div className="stat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <div>
                <span className="statNumber">4.9</span>
                <span className="statLabel">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="listContent">
        {/* Left Side - List Container */}
        <div className="listContainer">
          <div className="wrapper">
            {/* Filter Section */}
            <div className="filterSection">
              <Filter />
            </div>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="toolbarLeft">
                <Suspense fallback={<span className="resultCount">Loading...</span>}>
                  <Await resolve={data.postResponse}>
                    {(postResponse) => (
                      <div className="resultInfo">
                        <span className="resultCount">
                          {postResponse.data.length} Properties Found
                        </span>
                        <span className="resultSubtext">in your search area</span>
                      </div>
                    )}
                  </Await>
                </Suspense>
              </div>
              <div className="toolbarRight">
                <div className="sortDropdown" ref={sortRef}>
                  <button
                    className={`sortBtn ${sortOpen ? 'open' : ''}`}
                    aria-haspopup="listbox"
                    aria-expanded={sortOpen}
                    onClick={() => setSortOpen((s) => !s)}
                    title="Sort listings"
                  >
                    <svg xmlns="http://ww
                    
                    w.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sortIcon">
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                    <span className="sortLabel">{sortOptions.find(o => o.value === sortBy)?.label || 'Sort'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="caret">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  <ul className={`sortMenu ${sortOpen ? 'open' : ''}`} role="listbox" tabIndex={-1} aria-label="Sort options">
                    {sortOptions.map((opt) => (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={sortBy === opt.value}
                        className={`sortOption ${sortBy === opt.value ? 'selected' : ''}`}
                        onClick={() => handleSelect(opt.value)}
                      >
                        <span className="optionLabel">{opt.label}</span>
                        {sortBy === opt.value && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="viewToggle">
                  <button 
                    className={`viewBtn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </button>
                  <button 
                    className={`viewBtn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Property Cards */}
<div className={`cardsContainer ${viewMode === 'list' ? 'cardsContainer--list' : 'cardsContainer--grid'}`}>
              <Suspense fallback={
                <div className="loadingState">
                  <div className="loadingSpinner">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                  </div>
                  <p>Loading properties...</p>
                </div>
              }>
                <Await
                  resolve={data.postResponse}
                  errorElement={
                    <div className="errorState">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <p>Error loading properties!</p>
                      <button onClick={() => window.location.reload()}>Try Again</button>
                    </div>
                  }
                >
                  {(postResponse) => (
                    <>
                      {postResponse.data.length === 0 ? (
                        <div className="emptyState">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                          <h3>No Properties Found</h3>
                          <p>Try adjusting your filters to see more results</p>
                        </div>
                      ) : (
                        (() => {
                          // create a shallow copy and sort based on sortBy
                          const sortedPosts = [...postResponse.data];
                          switch (sortBy) {
                            case 'price-low':
                              sortedPosts.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
                              break;
                            case 'price-high':
                              sortedPosts.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
                              break;
                            case 'newest':
                              sortedPosts.sort((a, b) => {
                                const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                                const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                                return tb - ta;
                              });
                              break;
                            case 'featured':
                            default:
                              // put trending/featured items first, then newest
                              sortedPosts.sort((a, b) => {
                                const fa = a.trending ? 1 : 0;
                                const fb = b.trending ? 1 : 0;
                                if (fb - fa !== 0) return fb - fa;
                                const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                                const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                                return tb - ta;
                              });
                              break;
                          }

                          return sortedPosts.map((post, index) => (
                            <div 
                              key={post.id} 
                              className="cardWrapper"
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              {/* pass viewMode so Card can render list-style when requested */}
                              <Card item={post} viewMode={viewMode} />
                            </div>
                          ));
                        })()
                      )}
                    </>
                  )}
                </Await>
              </Suspense>
            </div>
          </div>
        </div>

        {/* Right Side - Map Container (header removed) */}
        <div className="mapContainer">
          <Suspense fallback={
            <div className="mapLoading">
              <div className="loadingSpinner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
              </div>
              <p>Loading map...</p>
            </div>
          }>
            <Await
              resolve={data.postResponse}
              errorElement={
                <div className="mapError">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p>Error loading map!</p>
                </div>
              }
            >
              {(postResponse) => <Map items={postResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ListPage;