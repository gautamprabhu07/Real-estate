// profile.jsx
import { Suspense, useContext, useMemo, useState } from "react";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { 
  HiPencil, 
  HiLogout,
  HiHome,
  HiHeart,
  HiChat,
  HiPlus,
  HiEye,
  HiLocationMarker,
  HiMail,
  HiDotsVertical
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
  const [activeTab, setActiveTab] = useState("listings");

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

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
      <div className="profilePage__container">
        {/* Header Card */}
        <div className="profilePage__header">
          <div className="profilePage__user">
            <div className="profilePage__avatar">
              <img src={userAvatarSrc} alt={currentUser?.username} />
              <div className="profilePage__avatar-status"></div>
            </div>
            <div className="profilePage__user-info">
              <h1>{currentUser?.username}</h1>
              <div className="profilePage__user-details">
                <span className="profilePage__detail">
                  <HiMail />
                  {currentUser?.email}
                </span>
                <span className="profilePage__detail">
                  <HiLocationMarker />
                  New York, USA
                </span>
              </div>
            </div>
          </div>
          <div className="profilePage__header-actions">
            <Link to="/profile/update" className="profilePage__btn profilePage__btn--ghost">
              <HiPencil />
              <span>Edit</span>
            </Link>
            <button className="profilePage__btn profilePage__btn--ghost" onClick={handleLogout}>
              <HiLogout />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="profilePage__stats">
          <div className="profilePage__stat">
            <div className="profilePage__stat-icon">
              <HiHome />
            </div>
            <div className="profilePage__stat-info">
              <span className="profilePage__stat-value">12</span>
              <span className="profilePage__stat-label">Listings</span>
            </div>
          </div>
          <div className="profilePage__stat">
            <div className="profilePage__stat-icon">
              <HiHeart />
            </div>
            <div className="profilePage__stat-info">
              <span className="profilePage__stat-value">8</span>
              <span className="profilePage__stat-label">Saved</span>
            </div>
          </div>
          <div className="profilePage__stat">
            <div className="profilePage__stat-icon">
              <HiEye />
            </div>
            <div className="profilePage__stat-info">
              <span className="profilePage__stat-value">342</span>
              <span className="profilePage__stat-label">Views</span>
            </div>
          </div>
          <div className="profilePage__stat">
            <div className="profilePage__stat-icon">
              <HiChat />
            </div>
            <div className="profilePage__stat-info">
              <span className="profilePage__stat-value">3</span>
              <span className="profilePage__stat-label">Messages</span>
            </div>
          </div>
        </div>

        <div className="profilePage__content">
          {/* Main Content */}
          <div className="profilePage__main">
            {/* Tabs */}
            <div className="profilePage__tabs">
              <button 
                className={`profilePage__tab ${activeTab === "listings" ? "profilePage__tab--active" : ""}`}
                onClick={() => setActiveTab("listings")}
              >
                <HiHome />
                My Listings
              </button>
              <button 
                className={`profilePage__tab ${activeTab === "saved" ? "profilePage__tab--active" : ""}`}
                onClick={() => setActiveTab("saved")}
              >
                <HiHeart />
                Saved Properties
              </button>
            </div>

            {/* Listings Section */}
            {activeTab === "listings" && (
              <div className="profilePage__section">
                <div className="profilePage__section-header">
                  <div>
                    <h2>My Listings</h2>
                    <p>Manage your property listings</p>
                  </div>
                  <Link
                    to="/add"
                    className="profilePage__btn profilePage__btn--primary"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    <HiPlus />
                    Add Property
                  </Link>
                </div>

                <Suspense fallback={
                  <div className="profilePage__loading">
                    <div className="profilePage__spinner"></div>
                    <p>Loading...</p>
                  </div>
                }>
                  <Await 
                    resolve={data.postResponse} 
                    errorElement={
                      <div className="profilePage__error">
                        <p>Failed to load listings</p>
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
                  <div>
                    <h2>Saved Properties</h2>
                    <p>Your bookmarked properties</p>
                  </div>
                </div>

                <Suspense fallback={
                  <div className="profilePage__loading">
                    <div className="profilePage__spinner"></div>
                    <p>Loading...</p>
                  </div>
                }>
                  <Await 
                    resolve={data.postResponse} 
                    errorElement={
                      <div className="profilePage__error">
                        <p>Failed to load saved properties</p>
                      </div>
                    }
                  >
                    {(postResponse) => <List posts={postResponse.savedPosts} />}
                  </Await>
                </Suspense>
              </div>
            )}
          </div>

          {/* Sidebar - Chat */}
          <aside className="profilePage__sidebar">
            <div className="profilePage__chat">
              <div className="profilePage__chat-header">
                <h3>Messages</h3>
                <span className="profilePage__chat-count">3</span>
              </div>

              <Suspense fallback={
                <div className="profilePage__loading profilePage__loading--compact">
                  <div className="profilePage__spinner"></div>
                </div>
              }>
                <Await 
                  resolve={data.chatResponse} 
                  errorElement={
                    <div className="profilePage__error profilePage__error--compact">
                      <p>Failed to load messages</p>
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
    </div>
  );
}

export default ProfilePage;