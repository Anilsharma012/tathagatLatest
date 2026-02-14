// SecondPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SecondPage.css";

// ✅ ONLY Mobile image (sliding image will show ONLY on mobile)
import mentorImageMobile from "../../../images/newyear.jpeg";

// ✅ Background image (TAT26)
import bgImage from "../../../images/TAT26.jpeg";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// NOTE: Font Awesome ka <link> index.html me daalo (JSX me <link> na rakho)

const badges = [
  "6th Best Coaching in India by INDIA TODAY",
  "No.1 CAT Coaching Institute in Delhi by Shiksha Coach",
  "No.1 CAT Coaching Institute by WAAC",
];

const examsSet = ["CAT | XAT | SNAP ", "CUET | IPMAT"];

// ✅ YouTube constants (as given — kept as-is)
const YT_ID = "LOtxfzDHcew";
const YT_URL = "https://youtu.be/LOtxfzDHcew?si=ZMeaSoUqEgjJybi5";
const YT_EMBED = `https://www.youtube.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1`;

// ✅ helper to build a prod-safe embed URL (nocookie + dynamic origin)
const buildSafeEmbed = (id, { autoplay = 1, jsapi = 1 } = {}) => {
  if (!id) return null;
  const base = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
  const ap = `&autoplay=${autoplay ? 1 : 0}`;
  const jp = jsapi ? "&enablejsapi=1" : "";
  const origin =
    typeof window !== "undefined"
      ? `&origin=${encodeURIComponent(window.location.origin)}`
      : "";
  return `${base}${ap}${jp}${origin}`;
};

const SecondPage = () => {
  const [badgeIndex, setBadgeIndex] = useState(0);
  const [examIndex, setExamIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  useEffect(() => {
    const badgeInterval = setInterval(() => {
      setBadgeIndex((prev) => (prev + 1) % badges.length);
    }, 3000);

    const examInterval = setInterval(() => {
      setExamIndex((prev) => (prev + 1) % examsSet.length);
    }, 2500);

    return () => {
      clearInterval(badgeInterval);
      clearInterval(examInterval);
    };
  }, []);

  // ESC se video modal band
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowVideo(false);
    if (showVideo) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showVideo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanks for your response!");
    setModalOpen(false);
  };

  const YT_EMBED_SAFE = buildSafeEmbed(YT_ID, { autoplay: 1, jsapi: 1 });

  return (
    <section className="mentors-wrapper">
      {/* ✅ Background image set via CSS variable (safe for Vite build) */}
      <div className="mentors-section" style={{ "--mentor-bg": `url(${bgImage})` }}>
        <div className="mentors-bg-text"></div>

        {/* Floating Badge */}
        <div className="mentors-fixed-badge">
          <div className="mentors-badge-content">{badges[badgeIndex]}</div>
        </div>

        <div className="mentors-grid">
          {/* LEFT BLOCK */}
          <div className="mentors-left-block">
            <div className="mentors-feature-tags">
              <span>
                <i className="fa fa-book"></i> Free Study Materials
              </span>
              <span>
                <i className="fa fa-thumbs-up"></i> 99% Success Rate
              </span>
              <span>
                <i className="fa fa-trophy"></i> Accredited
              </span>
              <span>
                <i className="fa fa-globe"></i> Online & Offline
              </span>
            </div>

            <h2 className="mentors-heading">
              Crack <span className="exam-text">{examsSet[examIndex]}</span>
              <br />
              with <span className="highlight">TathaGat</span>
            </h2>

            <p className="mentors-desc">
              Join the ranks of 1Lakh+ students got call from India's Best{" "}
              <br />
              B-Schools. Your success story starts here.
            </p>

            <div className="mentors-cta-buttons">
              <button className="btn-solid" onClick={() => navigate("/course-details")}>
                Join Now
              </button>
              <button className="btn-outline" onClick={() => setModalOpen(true)}>
                Free Counseling
              </button>
            </div>
          </div>

          {/* RIGHT BLOCK */}
          <div className="mentors-right-block">
            <div className="mentors-tab-buttons">
              <button onClick={() => navigate("/resource")}>Workshops</button>
              <button onClick={() => navigate("/team")}>Trainers</button>
              <button onClick={() => navigate("/Testimonial")}>Testimonials</button>
            </div>
            <div className="mentors-tab-buttonss">
              <button onClick={() => navigate("/course-purchase#cat-journey")}>
                Class-Flow
              </button>
              <button onClick={() => navigate("/score-card")}>Results</button>
              <button onClick={() => navigate("/faq")}>FAQs</button>
            </div>

            {/* Clickable video trigger */}
            <div
              className="mentors-video-block mentors-video-block--clickable"
              role="button"
              tabIndex={0}
              onClick={() => setShowVideo(true)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setShowVideo(true)}
              aria-label="Play TathaGat overview video"
              title="Watch on YouTube"
              data-youtube-url={YT_URL}
            >
              <span className="video-icon">▶</span>
              <div>
                <small>Watch Video</small>
                <br />
                <strong>TathaGat® Overview in 60 Seconds</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Modal */}
        {isModalOpen && (
          <div className="join-modal-overlay">
            <div className="join-modal-container">
              <button className="close-btn" onClick={() => setModalOpen(false)}>
                &times;
              </button>
              <h2>Send Us a Message</h2>
              <form className="join-form" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />
                <input type="text" name="address" placeholder="City" onChange={handleChange} required />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="4"
                  onChange={handleChange}
                  required
                ></textarea>
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideo && (
          <div className="video-modal" onClick={() => setShowVideo(false)}>
            <div className="video-modal__dialog" onClick={(e) => e.stopPropagation()}>
              <button className="video-modal__close" onClick={() => setShowVideo(false)} aria-label="Close video">
                ×
              </button>
              <div className="video-embed">
                <iframe
                  src={YT_EMBED_SAFE || YT_EMBED}
                  title="TathaGat Overview"
                  frameBorder="0"
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* ✅ Sliding Image (ONLY mobile me dikhegi CSS se) */}
        <div className="mentor-slide-container">
          <LazyLoadImage
            src={mentorImageMobile}
            alt="Mentors"
            className="mentor-slide-in"
            effect="blur"
            visibleByDefault
          />
        </div>
      </div>
    </section>
  );
};

export default SecondPage;
