import { Suspense, useContext, useMemo } from "react";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
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
      <section className="profileSection">
        <div className="profileCard">
          <header className="profileHeader">
            <div className="profileUser">
              <div className="avatarWrapper">
                <img
                  src={userAvatarSrc}
                  alt={currentUser?.username}
                  className="avatar"
                />
                <div className="statusIndicator"></div>
              </div>
              <div className="userInfo">
                <h2>{currentUser?.username}</h2>
                <p className="userEmail">{currentUser?.email}</p>
              </div>
            </div>
            <div className="profileActions">
              <Link to="/profile/update" className="updateBtn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.334 2.00004C11.5091 1.82494 11.7169 1.68605 11.9457 1.59129C12.1745 1.49653 12.4197 1.44775 12.6673 1.44775C12.9149 1.44775 13.1601 1.49653 13.3889 1.59129C13.6177 1.68605 13.8256 1.82494 14.0007 2.00004C14.1757 2.17513 14.3146 2.383 14.4094 2.61178C14.5042 2.84055 14.5529 3.08575 14.5529 3.33337C14.5529 3.58099 14.5042 3.82619 14.4094 4.05497C14.3146 4.28374 14.1757 4.49161 14.0007 4.66671L5.00065 13.6667L1.33398 14.6667L2.33398 11L11.334 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Update Profile
              </Link>
              <button className="logoutBtn" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </div>
          </header>

          <div className="statsBar">
            <div className="statItem">
              <div className="statIcon" style={{backgroundColor: '#e3f2fd'}}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z" fill="#1976d2"/>
                  <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="#1976d2" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="statContent">
                <span className="statValue">Active</span>
                <span className="statLabel">Account Status</span>
              </div>
            </div>
            <div className="statDivider"></div>
            <div className="statItem">
              <div className="statIcon" style={{backgroundColor: '#e8f5e9'}}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 3H6.5L9 13L16 13L18 6H7.5" stroke="#2e7d32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9.5" cy="16.5" r="1.5" fill="#2e7d32"/>
                  <circle cx="15.5" cy="16.5" r="1.5" fill="#2e7d32"/>
                </svg>
              </div>
              <div className="statContent">
                <span className="statValue">12</span>
                <span className="statLabel">Total Listings</span>
              </div>
            </div>
            <div className="statDivider"></div>
            <div className="statItem">
              <div className="statIcon" style={{backgroundColor: '#fff3e0'}}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3L3 8L10 13L17 8L10 3Z" stroke="#e65100" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 13L10 18L17 13" stroke="#e65100" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="statContent">
                <span className="statValue">8</span>
                <span className="statLabel">Saved Posts</span>
              </div>
            </div>
          </div>

          <div className="profileLists">
            <div className="listSection">
              <div className="sectionHeader">
                <div className="headerLeft">
                  <h3>My Listings</h3>
                  <span className="badge">Active</span>
                </div>
                <Link to="/add" className="primaryBtn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3.33337V12.6667M3.33333 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Create New Post
                </Link>
              </div>
              <Suspense fallback={<div className="loadingState">Loading your listings...</div>}>
                <Await resolve={data.postResponse} errorElement={<p className="errorState">Error loading posts!</p>}>
                  {(postResponse) => <List posts={postResponse.userPosts} />}
                </Await>
              </Suspense>
            </div>

            <div className="listSection">
              <div className="sectionHeader">
                <div className="headerLeft">
                  <h3>Saved Listings</h3>
                  <span className="badge secondary">Favorites</span>
                </div>
              </div>
              <Suspense fallback={<div className="loadingState">Loading saved listings...</div>}>
                <Await resolve={data.postResponse} errorElement={<p className="errorState">Error loading posts!</p>}>
                  {(postResponse) => <List posts={postResponse.savedPosts} />}
                </Await>
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <aside className="chatSection">
        <div className="chatWrapper">
          
          <Suspense fallback={<div className="loadingState">Loading messages...</div>}>
            <Await resolve={data.chatResponse} errorElement={<p className="errorState">Error loading chats!</p>}>
              {(chatResponse) => <Chat chats={chatResponse} />}
            </Await>
          </Suspense>
        </div>
      </aside>
    </div>
  );
}

export default ProfilePage;