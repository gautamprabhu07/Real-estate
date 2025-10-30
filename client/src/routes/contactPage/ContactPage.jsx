import "./contact.scss";
import { HiMail, HiPhone, HiLocationMarker, HiChat } from "react-icons/hi";
import { useState } from "react";

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    // Simulate API call
    setTimeout(() => {
      setStatus("Thank you for reaching out! Our team will get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <div className="contactWrapper">
      <div className="contactInfo">
        <h1>Contact Us</h1>
        <p>
          Have questions about properties, want to schedule a viewing, or need support? Reach out and we'll be happy to help!
        </p>
        <ul>
          <li>
            <HiMail className="icon" /> <span>support@buildingco.com</span>
          </li>
          <li>
            <HiPhone className="icon" /> <span>+1 987-654-3210</span>
          </li>
          <li>
            <HiLocationMarker className="icon" /> <span>123 Market Street, New York, NY</span>
          </li>
          <li>
            <HiChat className="icon" /> <span>Live chat available 8am–8pm</span>
          </li>
        </ul>
        <div className="contactTrust">
          <strong>We value your privacy</strong>
          <span>All inquiries are confidential.</span>
        </div>
      </div>
      <div className="contactFormBox">
        <h2>Send us a Message</h2>
        <form onSubmit={handleSubmit} className="contactForm">
          <label htmlFor="name">Your Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
            minLength={2}
          />

          <label htmlFor="email">Your Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="How can we help you?"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="submitBtn"
            disabled={status === "Sending..."}
          >
            {status === "Sending..." ? "Sending..." : "Send Message"}
          </button>
          {status && <div className={status === "Sending..." ? "sendingMsg" : "successMsg"}>{status}</div>}
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
