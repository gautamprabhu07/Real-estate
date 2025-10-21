import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await apiRequest.post("/auth/login", formData);
      updateUser(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginWrapper">
      <div className="loginLeft">
        <h2>Welcome Back</h2>
        <p>Log in to access your Building CO. dashboard</p>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={onChange}
            required
            minLength={3}
            maxLength={20}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={onChange}
            required
          />

          {error && <p className="errorMsg">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="registerLink">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </form>
      </div>

      <div className="loginRight">
        <img
          src="/reg.png"
          alt="Real estate visual"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default LoginPage;
