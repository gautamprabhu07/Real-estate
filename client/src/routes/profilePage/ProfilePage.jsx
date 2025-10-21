import { Suspense, useContext } from "react";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import Chat from "../../components/chats/Chat";
import List from "../../components/lists/List";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
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

  return (
    <div className="profilePage">
      <section className="profileSection">
        <div className="profileCard">
          <header className="profileHeader">
            <div className="profileUser">
              <img
                src={currentUser?.avatar || "/noavatar.jpg"}
                alt={currentUser?.username}
                className="avatar"
              />
              <div>
                <h2>{currentUser?.username}</h2>
                <p>{currentUser?.email}</p>
              </div>
            </div>
            <div className="profileActions">
              <Link to="/profile/update" className="updateBtn">
                Update Profile
              </Link>
              <button className="logoutBtn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          <div className="profileStats">
            <div className="statCard">
              <h3>16+</h3>
              <p>Years of Experience</p>
            </div>
            <div className="statCard">
              <h3>200</h3>
              <p>Listings Managed</p>
            </div>
            <div className="statCard">
              <h3>2000+</h3>
              <p>Properties Sold</p>
            </div>
          </div>

          <div className="profileLists">
            <div className="sectionHeader">
              <h3>My Listings</h3>
              <Link to="/add" className="primaryBtn">+ Create New Post</Link>
            </div>
            <Suspense fallback={<p>Loading...</p>}>
              <Await
                resolve={data.postResponse}
                errorElement={<p>Error loading posts!</p>}
              >
                {(postResponse) => (
                  <List posts={postResponse.data.userPosts} />
                )}
              </Await>
            </Suspense>

            <div className="sectionHeader">
              <h3>Saved Listings</h3>
            </div>
            <Suspense fallback={<p>Loading...</p>}>
              <Await
                resolve={data.postResponse}
                errorElement={<p>Error loading posts!</p>}
              >
                {(postResponse) => (
                  <List posts={postResponse.data.savedPosts} />
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </section>

      <aside className="chatSection">
        <div className="chatWrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </aside>
    </div>
  );
}

export default ProfilePage;
