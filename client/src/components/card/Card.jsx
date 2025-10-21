import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item }) {
  return (
    <div className="card">
      <Link to={`/${item.id}`} className="card__image">
        <img src={item.images?.[0] || "/noimage.jpg"} alt={item.title} />
      </Link>

      <div className="card__content">
        <Link to={`/${item.id}`} className="card__title">
          {item.title}
        </Link>

        <p className="card__address">
          <img src="/pin.png" alt="Address" />
          <span>{item.address}</span>
        </p>

        <p className="card__price">${item.price.toLocaleString()}</p>

        <div className="card__bottom">
          <div className="card__features">
            <div className="feature">
              <img src="/bed.png" alt="Bedrooms" />
              <span>{item.bedroom} Beds</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="Bathrooms" />
              <span>{item.bathroom} Baths</span>
            </div>
          </div>

          <div className="card__icons">
            <button className="icon">
              <img src="/save.png" alt="Save" />
            </button>
            <button className="icon">
              <img src="/chat.png" alt="Chat" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
