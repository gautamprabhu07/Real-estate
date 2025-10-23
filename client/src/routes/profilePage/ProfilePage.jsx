// profile.jsx
import { Suspense, useContext, useMemo, useState } from "react";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { 
  HiPencil, 
  HiLogout,
  HiCheckCircle,
  HiHome,
  HiHeart,
  HiChat,
  HiPlus,
  HiTrendingUp,
  HiEye,
  HiChartBar,
  HiLocationMarker,
  HiClock,
  HiBadgeCheck,
  HiStar,
  HiUserGroup
} from "react-icons/hi";
import Chat from "../../components/chats/Chat";
import List from "../../components/lists/List";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";
import "./profile.scss";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("listings"); // 'listings' or 'saved'

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // Generate random avatar if no user avatar
  const generatedAvatar = useMemo(() => {
    if (!currentUser) return null;
    return createAvatar(bottts, {
      seed: currentUser.username || "default-user",
      size: 80,
      backgroundType: ["gradientLinear"],
      backgroundColor: ["b6e3f4", "c0aede", "d1f4a5"],
    }).toDataUri();
  }, [currentUser]);

  const userAvatarSrc = currentUser?.avatar || generatedAvatar;

  return (
    <div className="profilePage">
      {/* Hero Header Section */}
      <div className="profilePage__hero">
        <div className="profilePage__hero-pattern"></div>
        <div className="profilePage__hero-content">
          <div className="profilePage__user-card">
            <div className="profilePage__avatar-section">
              <div className="profilePage__avatar-wrapper">
                <img
                  src={userAvatarSrc}
                  alt={currentUser?.username}
                  className="profilePage__avatar"
                />
                <div className="profilePage__status-indicator">
                  <HiCheckCircle />
                </div>
                <div className="profilePage__avatar-border"></div>
              </div>
              <button className="profilePage__avatar-edit">
                <HiPencil />
              </button>
            </div>

            <div className="profilePage__user-info">
              <div className="profilePage__user-header">
                <h1 className="profilePage__username">{currentUser?.username}</h1>
                <div className="profilePage__verified-badge">
                  <HiBadgeCheck />
                  <span>Verified</span>
                </div>
              </div>
              <p className="profilePage__email">{currentUser?.email}</p>
              <div className="profilePage__user-meta">
                <div className="profilePage__meta-item">
                  <HiLocationMarker />
                  <span>New York, USA</span>
                </div>
                <div className="profilePage__meta-item">
                  <HiClock />
                  <span>Member since 2024</span>
                </div>
              </div>
            </div>

            <div className="profilePage__actions">
              <Link to="/profile/update" className="profilePage__btn profilePage__btn--primary">
                <HiPencil />
                <span>Edit Profile</span>
              </Link>
              <button className="profilePage__btn profilePage__btn--secondary" onClick={handleLogout}>
                <HiLogout />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="profilePage__container">
        {/* Main Content */}
        <section className="profilePage__main">
          {/* Stats Cards */}
          <div className="profilePage__stats">
            <div className="profilePage__stat-card profilePage__stat-card--primary">
              <div className="profilePage__stat-icon">
                <HiHome />
              </div>
              <div className="profilePage__stat-content">
                <span className="profilePage__stat-value">12</span>
                <span className="profilePage__stat-label">Active Listings</span>
              </div>
              <div className="profilePage__stat-trend profilePage__stat-trend--up">
                <HiTrendingUp />
                <span>+2 this week</span>
              </div>
            </div>

            <div className="profilePage__stat-card profilePage__stat-card--success">
              <div className="profilePage__stat-icon">
                <HiHeart />
              </div>
              <div className="profilePage__stat-content">
                <span className="profilePage__stat-value">8</span>
                <span className="profilePage__stat-label">Saved Properties</span>
              </div>
              <div className="profilePage__stat-trend">
                <HiStar />
                <span>Favorites</span>
              </div>
            </div>

            <div className="profilePage__stat-card profilePage__stat-card--info">
              <div className="profilePage__stat-icon">
                <HiEye />
              </div>
              <div className="profilePage__stat-content">
                <span className="profilePage__stat-value">1.2K</span>
                <span className="profilePage__stat-label">Profile Views</span>
              </div>
              <div className="profilePage__stat-trend profilePage__stat-trend--up">
                <HiTrendingUp />
                <span>+15% this month</span>
              </div>
            </div>

            <div className="profilePage__stat-card profilePage__stat-card--warning">
              <div className="profilePage__stat-icon">
                <HiChartBar />
              </div>
              <div className="profilePage__stat-content">
                <span className="profilePage__stat-value">45</span>
                <span className="profilePage__stat-label">Inquiries</span>
              </div>
              <div className="profilePage__stat-trend">
                <HiUserGroup />
                <span>Interested buyers</span>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="profilePage__tabs">
            <button 
              className={`profilePage__tab ${activeTab === "listings" ? "profilePage__tab--active" : ""}`}
              onClick={() => setActiveTab("listings")}
            >
              <HiHome />
              <span>My Listings</span>
              <div className="profilePage__tab-badge">12</div>
            </button>
            <button 
              className={`profilePage__tab ${activeTab === "saved" ? "profilePage__tab--active" : ""}`}
              onClick={() => setActiveTab("saved")}
            >
              <HiHeart />
              <span>Saved Properties</span>
              <div className="profilePage__tab-badge">8</div>
            </button>
          </div>

          {/* Listings Section */}
          {activeTab === "listings" && (
            <div className="profilePage__section">
              <div className="profilePage__section-header">
                <div className="profilePage__section-title">
                  <h2>My Property Listings</h2>
                  <p>Manage and track your active property listings</p>
                </div>
                <Link to="/add" className="profilePage__add-btn">
                  <HiPlus />
                  <span>Add New Property</span>
                  <div className="profilePage__btn-shine"></div>
                </Link>
              </div>

              <Suspense fallback={
                <div className="profilePage__loading">
                  <div className="profilePage__loading-spinner"></div>
                  <p>Loading your listings...</p>
                </div>
              }>
                <Await 
                  resolve={data.postResponse} 
                  errorElement={
                    <div className="profilePage__error">
                      <p>Error loading posts!</p>
                    </div>
                  }
                >
                  {(postResponse) => <List posts={postResponse.userPosts} />}
                </Await>
              </Suspense>
            </div>
          )}

          {/* Saved Section */}
          {activeTab === "saved" && (
            <div className="profilePage__section">
              <div className="profilePage__section-header">
                <div className="profilePage__section-title">
                  <h2>Saved Properties</h2>
                  <p>Properties you've bookmarked for later</p>
                </div>
              </div>

              <Suspense fallback={
                <div className="profilePage__loading">
                  <div className="profilePage__loading-spinner"></div>
                  <p>Loading saved properties...</p>
                </div>
              }>
                <Await 
                  resolve={data.postResponse} 
                  errorElement={
                    <div className="profilePage__error">
                      <p>Error loading posts!</p>
                    </div>
                  }
                >
                  {(postResponse) => <List posts={postResponse.savedPosts} />}
                </Await>
              </Suspense>
            </div>
          )}
        </section>

        {/* Sidebar - Chat Section */}
        <aside className="profilePage__sidebar">
          <div className="profilePage__chat-card">
            <div className="profilePage__chat-header">
              <div className="profilePage__chat-title">
                <HiChat />
                <h3>Messages</h3>
              </div>
              <div className="profilePage__chat-badge">3</div>
            </div>

            <Suspense fallback={
              <div className="profilePage__loading profilePage__loading--compact">
                <div className="profilePage__loading-spinner"></div>
                <p>Loading messages...</p>
              </div>
            }>
              <Await 
                resolve={data.chatResponse} 
                errorElement={
                  <div className="profilePage__error profilePage__error--compact">
                    <p>Error loading chats!</p>
                  </div>
                }
              >
                {(chatResponse) => <Chat chats={chatResponse} />}
              </Await>
            </Suspense>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProfilePage;