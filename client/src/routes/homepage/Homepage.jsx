import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homepage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <section className="homepage">
      <div className="homepage__content">
        <div className="homepage__wrapper">
          <h1 className="homepage__title">Find Real Estate & Secure Your Dream Home</h1>
          <p className="homepage__subtitle">
            Explore verified properties tailored to your needs. Seamless buying, selling, and renting experience powered by UrbanLuxe.
          </p>
          <SearchBar />
          <div className="homepage__stats">
            <div className="homepage__statBox">
              <h2>16+</h2>
              <p>Years of Experience</p>
            </div>
            <div className="homepage__statBox">
              <h2>200</h2>
              <p>Awards Gained</p>
            </div>
            <div className="homepage__statBox">
              <h2>2000+</h2>
              <p>Properties Ready</p>
            </div>
          </div>
        </div>
      </div>
      <aside className="homepage__imageContainer" aria-hidden="true">
        <img src="/home.jpg" alt="Luxury real estate house" loading="lazy" />
      </aside>
    </section>
  );
}

export default HomePage;
