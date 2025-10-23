import { useState, useEffect } from "react";
import "./slider.scss";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    // Preload first image
    if (images && images.length > 0) {
      const img = new Image();
      img.src = images[0];
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, 0: true }));
        setIsLoading(false);
      };
    }
  }, [images]);

  const changeSlide = (direction) => {
    if (direction === "left") {
      setImageIndex(imageIndex === 0 ? images.length - 1 : imageIndex - 1);
    } else if (direction === "right") {
      setImageIndex(imageIndex === images.length - 1 ? 0 : imageIndex + 1);
    }
  };

  const handleKeyPress = (e) => {
    if (imageIndex === null) return;
    if (e.key === "Escape") setImageIndex(null);
    if (e.key === "ArrowLeft") changeSlide("left");
    if (e.key === "ArrowRight") changeSlide("right");
  };

  useEffect(() => {
    if (imageIndex !== null) {
      document.addEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "auto";
    };
  }, [imageIndex]);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  if (!images || images.length === 0) {
    return (
      <div className="slider emptySlider">
        <div className="emptyState">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="slider">
      {/* Full Screen Slider */}
      {imageIndex !== null && (
        <div className="fullSlider" onClick={(e) => e.target.classList.contains('fullSlider') && setImageIndex(null)}>
          <div className="fullSliderContent">
            {/* Navigation Arrows */}
            <button 
              className="arrow left" 
              onClick={() => changeSlide("left")}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Image Container */}
            <div className="imgContainer">
              <img 
                src={images[imageIndex]} 
                alt={`Property view ${imageIndex + 1}`}
                loading="lazy"
              />
              
              {/* Image Counter */}
              <div className="imageCounter">
                <span className="currentImage">{imageIndex + 1}</span>
                <span className="separator">/</span>
                <span className="totalImages">{images.length}</span>
              </div>

              {/* Navigation Dots */}
              <div className="navigationDots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === imageIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageIndex(index);
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <button 
              className="arrow right" 
              onClick={() => changeSlide("right")}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            {/* Close Button */}
            <button 
              className="close" 
              onClick={() => setImageIndex(null)} 
              aria-label="Close gallery"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Download Button */}
            <a 
              href={images[imageIndex]} 
              download
              className="downloadBtn"
              onClick={(e) => e.stopPropagation()}
              aria-label="Download image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Main Image */}
      <div className="bigImage">
        <div className={`imageWrapper ${loadedImages[0] ? 'loaded' : ''}`}>
          {isLoading && (
            <div className="imageSkeleton">
              <div className="skeletonShimmer"></div>
            </div>
          )}
          <img 
            src={images[0]} 
            alt="Main property view" 
            onClick={() => setImageIndex(0)}
            onLoad={() => handleImageLoad(0)}
          />
          
          {/* View Gallery Badge */}
          <div className="galleryBadge" onClick={() => setImageIndex(0)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>View Gallery</span>
          </div>

          {/* Image Count Badge */}
          <div className="imageCountBadge">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>{images.length} Photos</span>
          </div>
        </div>
      </div>

      {/* Thumbnail Images */}
      <div className="smallImages">
        {images.slice(1, 4).map((image, index) => (
          <div 
            key={index} 
            className={`thumbnailWrapper ${loadedImages[index + 1] ? 'loaded' : ''}`}
            onClick={() => setImageIndex(index + 1)}
          >
            {!loadedImages[index + 1] && (
              <div className="imageSkeleton">
                <div className="skeletonShimmer"></div>
              </div>
            )}
            <img
              src={image}
              alt={`Property view ${index + 2}`}
              onLoad={() => handleImageLoad(index + 1)}
              loading="lazy"
            />
            
            {/* Show remaining count on last thumbnail if more than 4 images */}
            {index === 2 && images.length > 4 && (
              <div className="moreImagesOverlay">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <span>+{images.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Slider;