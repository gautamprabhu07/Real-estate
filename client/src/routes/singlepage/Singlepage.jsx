import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
    setShowShareMenu(false);
  };




  const agentAvatarSrc = useMemo(() => {
    if (post.user && post.user.avatar) {
      return post.user.avatar;
    }
    // Use username or fallback seed for deterministic avatar
    const seed = post.user?.username || "agent";
    return createAvatar(bottts, {
      seed,
      backgroundType: ["gradientLinear"],
      backgroundColor: ["b6e3f4", "c0aede", "d1f4a5"],
      size: 80,
    }).toDataUri();
  }, [post.user]);

  return (
    <div className={`singlePage ${isLoaded ? 'loaded' : ''}`}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} className="breadcrumbItem">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          Home
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <span className="breadcrumbItem">Properties</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <span className="breadcrumbItem active">{post.title}</span>
      </div>

      <div className="details">
        <div className="wrapper">
          {/* Property Header */}
          <div className="propertyHeader">
            <div className="headerLeft">
              <div className="propertyBadge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span>{post.type || 'For Sale'}</span>
              </div>
              <h1>{post.title}</h1>
              <div className="address">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{post.address}</span>
              </div>
            </div>
            <div className="headerRight">
              <div className="priceCard">
                <span className="priceLabel">Price</span>
                <div className="price">${post.price.toLocaleString()}</div>
                <span className="priceNote">Negotiable</span>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="sliderSection">
            <Slider images={post.images} />
          </div>

          {/* Quick Stats */}
          <div className="quickStats">
            <div className="statCard">
              <div className="statIcon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div className="statInfo">
                <span className="statValue">{post.bedroom}</span>
                <span className="statLabel">Bedrooms</span>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1 0l-1 1a1.5 1.5 0 0 0 0 1L7 9"></path>
                  <path d="m9 6 .5 2.5"></path>
                  <path d="M6 9h3"></path>
                  <circle cx="16" cy="17" r="1"></circle>
                </svg>
              </div>
              <div className="statInfo">
                <span className="statValue">{post.bathroom}</span>
                <span className="statLabel">Bathrooms</span>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
              </div>
              <div className="statInfo">
                <span className="statValue">{post.sqft ?? post.postDetail?.size ?? "—"}</span>
                <span className="statLabel">Sq Ft</span>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div className="statInfo">
                <span className="statValue">{post.yearBuilt ?? "—"}</span>
                <span className="statLabel">Year Built</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="descriptionSection">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Property Description
            </h2>
            <div
              className="description"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            />
          </div>

          {/* Agent Card */}
          <div className="agentCard">
            <div className="agentHeader">
              <h3>Property Agent</h3>
              <span className="verifiedBadge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Verified
              </span>
            </div>
            <div className="agentContent">
              <div className="agentInfo">
                <div className="agentAvatar">
                   <img src={agentAvatarSrc} alt={`${post.user?.username || 'Agent'} avatar`} />
                  <div className="onlineIndicator"></div>
                </div>
                <div className="agentDetails">
                  <h4>{post.user.username}</h4>
                  <p>Real Estate Specialist</p>
                  <div className="agentRating">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>4.9 (127 reviews)</span>
                  </div>
                </div>
              </div>
              <div className="agentStats">
                <div className="agentStat">
                  <span className="statNumber">12</span>
                  <span className="statText">Properties</span>
                </div>
                <div className="agentStat">
                  <span className="statNumber">-</span>
                  <span className="statText">Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">
          {/* Property Overview */}
          <div className="section">
            <h2 className="sectionTitle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              Property Overview
            </h2>
            <div className="featureGrid">
              <div className="featureItem">
                <div className="featureIcon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="featureContent">
                  <span className="featureLabel">Utilities</span>
                  <p className="featureValue">
                    {post.postDetail.utilities === "owner"
                      ? "Owner Responsible"
                      : post.postDetail.utilities === "tenant"
                      ? "Tenant Responsible"
                      : "Shared"}
                  </p>
                </div>
              </div>
              <div className="featureItem">
                <div className="featureIcon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3"></circle>
                    <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z"></path>
                  </svg>
                </div>
                <div className="featureContent">
                  <span className="featureLabel">Pet Policy</span>
                  <p className="featureValue">
                    {post.postDetail.pet === "allowed" ? "Pets Allowed" : "No Pets"}
                  </p>
                </div>
              </div>
              <div className="featureItem">
                <div className="featureIcon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="featureContent">
                  <span className="featureLabel">Income Policy</span>
                  <p className="featureValue">{post.postDetail.income || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Places */}
          <div className="section">
            <h2 className="sectionTitle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Nearby Places
            </h2>
            <div className="nearbyPlaces">
              <div className="placeItem">
                <div className="placeIcon school">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <div className="placeInfo">
                  <span className="placeName">School</span>
                  <span className="placeDistance">
                    {post.postDetail.school > 999
                      ? (post.postDetail.school / 1000).toFixed(1) + " km"
                      : post.postDetail.school + " m"}
                  </span>
                </div>
              </div>
              <div className="placeItem">
                <div className="placeIcon bus">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 6v6"></path>
                    <path d="M15 6v6"></path>
                    <path d="M2 12h19.6"></path>
                    <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
                    <circle cx="7" cy="18" r="2"></circle>
                    <circle cx="16" cy="18" r="2"></circle>
                  </svg>
                </div>
                <div className="placeInfo">
                  <span className="placeName">Bus Stop</span>
                  <span className="placeDistance">{post.postDetail.bus} m</span>
                </div>
              </div>
              <div className="placeItem">
                <div className="placeIcon restaurant">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                    <path d="M7 2v20"></path>
                    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                  </svg>
                </div>
                <div className="placeInfo">
                  <span className="placeName">Restaurant</span>
                  <span className="placeDistance">{post.postDetail.restaurant} m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="section">
            <h2 className="sectionTitle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
              Location
            </h2>
            <div className="mapContainer">
              <Map items={[post]} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="actionButtons">
            <button className="actionBtn primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Send Message
            </button>
            <button
              onClick={handleSave}
              className={`actionBtn ${saved ? 'saved' : 'secondary'}`}
              aria-pressed={saved}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              {saved ? "Saved" : "Save Property"}
            </button>
            <button className="actionBtn secondary" onClick={handleShare}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share
            </button>
            {showShareMenu && (
              <div className="shareMenu">
                <button onClick={copyLink}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;