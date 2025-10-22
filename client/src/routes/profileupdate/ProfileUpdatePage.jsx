import { useContext, useMemo, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();

  // Generate random DiceBear avatar (same as profile page)
  const generatedAvatar = useMemo(() => {
    if (!currentUser) return null;
    return createAvatar(bottts, {
      seed: currentUser.username || "default-user",
      size: 128,
      backgroundType: ["gradientLinear"],
      backgroundColor: ["b6e3f4", "c0aede", "d1f4a5"],
    }).toDataUri();
  }, [currentUser]);

  const userAvatar =
    avatar[0] || currentUser?.avatar || generatedAvatar || "/noavatar.jpg";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar: avatar[0],
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="card">
        <h1 className="pageTitle">Update Your Profile</h1>

        <div className="avatarSection">
          <div className="avatarWrapper">
            <img src={userAvatar} alt="User Avatar" className="avatar" />
          </div>

          <div className="uploader">
            <UploadWidget
              uwConfig={{
                cloudName: "lamadev",
                uploadPreset: "estate",
                multiple: false,
                maxImageFileSize: 2000000,
                folder: "avatars",
              }}
              setState={setAvatar}
            />
            <small className="hint">PNG/JPG up to 2MB. Square preferred.</small>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="updateForm">
          <div className="inputRow">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser?.username || ""}
              placeholder="Enter your username"
            />
          </div>

          <div className="inputRow">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser?.email || ""}
              placeholder="Enter your email"
            />
          </div>

          <div className="inputRow">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter new password"
            />
          </div>

          <div className="actions">
            <button type="submit" className="updateButton">
              Save Changes
            </button>
          </div>

          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
