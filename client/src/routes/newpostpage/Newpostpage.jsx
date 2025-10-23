import { useState } from "react";
import "./newpost.scss";
import { Editor } from "@tinymce/tinymce-react";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  DollarSign, 
  MapPin, 
  FileText, 
  Bed, 
  Bath, 
  Map, 
  Building, 
  Droplet, 
  PawPrint, 
  CreditCard, 
  Ruler, 
  School, 
  Bus, 
  UtensilsCrossed,
  ImageIcon,
  Sparkles
} from "lucide-react";

function NewPostPage() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: content,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Submission error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newPostPage">
      <div className="heroSection">
        <div className="heroContent">
          <Sparkles className="sparkleIcon" />
          <h1>List Your Property</h1>
          <p>Create a stunning listing in minutes and reach thousands of potential buyers or renters</p>
        </div>
      </div>

      <div className="contentWrapper">
        <div className="formContainer">
          <div className="formWrapper">
            <form onSubmit={handleSubmit}>
              <div className="section">
                <h2 className="sectionTitle">
                  <Home size={20} />
                  Basic Information
                </h2>
                <div className="inputGrid">
                  <div className="item">
                    <label htmlFor="title">
                      <FileText size={16} />
                      Property Title
                    </label>
                    <input 
                      id="title" 
                      name="title" 
                      type="text" 
                      placeholder="Beautiful 3BR apartment in downtown" 
                      required 
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="price">
                      <DollarSign size={16} />
                      Price
                    </label>
                    <input 
                      id="price" 
                      name="price" 
                      type="number" 
                      min={0} 
                      placeholder="2500" 
                      required 
                    />
                  </div>
                  <div className="item fullWidth">
                    <label htmlFor="address">
                      <MapPin size={16} />
                      Street Address
                    </label>
                    <input 
                      id="address" 
                      name="address" 
                      type="text" 
                      placeholder="123 Main Street" 
                      required 
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="city">
                      <Building size={16} />
                      City
                    </label>
                    <input 
                      id="city" 
                      name="city" 
                      type="text" 
                      placeholder="San Francisco" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="section">
                <h2 className="sectionTitle">
                  <FileText size={20} />
                  Description
                </h2>
                <div className="item description">
                  <Editor
                    apiKey="i39rjm54kl1t91xpkh0b3s3v2hc736zvl8sc7cvtdnjmryas"
                    value={content}
                    init={{
                      height: 280,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste help wordcount"
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic underline | " +
                        "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help"
                    }}
                    onEditorChange={handleEditorChange}
                    textareaName="desc"
                    placeholder="Describe your property in detail..."
                  />
                </div>
              </div>

              <div className="section">
                <h2 className="sectionTitle">
                  <Home size={20} />
                  Property Details
                </h2>
                <div className="inputGrid">
                  <div className="item">
                    <label htmlFor="bedroom">
                      <Bed size={16} />
                      Bedrooms
                    </label>
                    <input 
                      min={1} 
                      id="bedroom" 
                      name="bedroom" 
                      type="number" 
                      placeholder="3" 
                      required 
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="bathroom">
                      <Bath size={16} />
                      Bathrooms
                    </label>
                    <input 
                      min={1} 
                      id="bathroom" 
                      name="bathroom" 
                      type="number" 
                      placeholder="2" 
                      required 
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="size">
                      <Ruler size={16} />
                      Size (sqft)
                    </label>
                    <input 
                      min={0} 
                      id="size" 
                      name="size" 
                      type="number" 
                      placeholder="1200" 
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="type">Sale Type</label>
                    <select name="type" defaultValue="rent" required>
                      <option value="rent">For Rent</option>
                      <option value="buy">For Sale</option>
                    </select>
                  </div>
                  <div className="item">
                    <label htmlFor="property">Property Type</label>
                    <select name="property" defaultValue="apartment" required>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                      <option value="land">Land</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="section">
                <h2 className="sectionTitle">
                  <Map size={20} />
                  Location Coordinates
                </h2>
                <div className="inputGrid">
                  <div className="item">
                    <label htmlFor="latitude">Latitude</label>
                    <input 
                      id="latitude" 
                      name="latitude" 
                      type="text" 
                      placeholder="37.7749" 
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="longitude">Longitude</label>
                    <input 
                      id="longitude" 
                      name="longitude" 
                      type="text" 
                      placeholder="-122.4194" 
                    />
                  </div>
                </div>
              </div>

              <div className="section">
                <h2 className="sectionTitle">
                  <FileText size={20} />
                  Policies & Amenities
                </h2>
                <div className="inputGrid">
                  <div className="item">
                    <label htmlFor="utilities">
                      <Droplet size={16} />
                      Utilities Policy
                    </label>
                    <select name="utilities" defaultValue="owner" required>
                      <option value="owner">Owner Pays</option>
                      <option value="tenant">Tenant Pays</option>
                      <option value="shared">Shared</option>
                    </select>
                  </div>
                  <div className="item">
                    <label htmlFor="pet">
                      <PawPrint size={16} />
                      Pet Policy
                    </label>
                    <select name="pet" defaultValue="allowed" required>
                      <option value="allowed">Pets Allowed</option>
                      <option value="not-allowed">No Pets</option>
                    </select>
                  </div>
                  <div className="item fullWidth">
                    <label htmlFor="income">
                      <CreditCard size={16} />
                      Income Requirements
                    </label>
                    <input 
                      id="income" 
                      name="income" 
                      type="text" 
                      placeholder="3x monthly rent required" 
                    />
                  </div>
                </div>
              </div>

              <div className="section">
                <h2 className="sectionTitle">
                  <MapPin size={20} />
                  Nearby Amenities
                </h2>
                <div className="inputGrid">
                  <div className="item">
                    <label htmlFor="school">
                      <School size={16} />
                      School (miles)
                    </label>
                    <input 
                      min={0} 
                      id="school" 
                      name="school" 
                      type="number" 
                      step="0.1"
                      placeholder="0.5" 
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="bus">
                      <Bus size={16} />
                      Bus Stop (miles)
                    </label>
                    <input 
                      min={0} 
                      id="bus" 
                      name="bus" 
                      type="number" 
                      step="0.1"
                      placeholder="0.2" 
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="restaurant">
                      <UtensilsCrossed size={16} />
                      Restaurant (miles)
                    </label>
                    <input 
                      min={0} 
                      id="restaurant" 
                      name="restaurant" 
                      type="number" 
                      step="0.1"
                      placeholder="0.3" 
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="sendButton" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Publish Property
                  </>
                )}
              </button>
              {error && (
                <div className="errorMessage">
                  <span>⚠️ {error}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="sideContainer">
          <div className="uploadSection">
            <div className="uploadHeader">
              <ImageIcon size={24} />
              <h3>Property Images</h3>
              <p>Add high-quality photos to attract more interest</p>
            </div>
            
            <div className="imageGrid">
              {images.length === 0 ? (
                <div className="emptyState">
                  <ImageIcon size={48} />
                  <p>No images uploaded yet</p>
                  <span>Click below to add photos</span>
                </div>
              ) : (
                images.map((image, index) => (
                  <div key={index} className="imageCard">
                    <img src={image} alt={`Property ${index + 1}`} />
                    <div className="imageOverlay">
                      <span>Image {index + 1}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <UploadWidget
              uwConfig={{
                multiple: true,
                cloudName: "lamadev",
                uploadPreset: "estate",
                folder: "posts",
              }}
              setState={setImages}
            />
          </div>

          <div className="tipsCard">
            <h4>💡 Listing Tips</h4>
            <ul>
              <li>Use clear, well-lit photos</li>
              <li>Write detailed descriptions</li>
              <li>Highlight unique features</li>
              <li>Be honest about the property</li>
              <li>Update pricing regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;