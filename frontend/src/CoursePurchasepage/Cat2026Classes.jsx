// ClassicOMETOfflinePage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Cat2026Classes.css";

// --- Images (adjust paths if needed) ---
import imgKumar from "../images/Team/KumarSir.png";
import imgManish from "../images/Team/MANISH-removebg-preview1 - Copy.png";
import imgNeeraj from "../images/Team/Niraj-Sir.png";

import reviewMain from "../images/Review/Review/27.png";
import review3 from "../images/Reviewnewimage.jpeg";
import review4 from "../images/Reviewnewimage3.jpg";
import review6 from "../images/Reviewnewimage6.jpg";
import Chatbox from "../components/Chat/Chatbox";

// --------------- Static Content ---------------
const RAZORPAY_URL =
  "https://pages.razorpay.com/pl_L4RlLDUmQHzJRO/view";

const INSTRUCTORS = [
  { name: "Kumar Sir", expertise: "Quant / LRDI", image: imgKumar },
  { name: "Manish Sir", expertise: "VARC", image: imgManish },
  { name: "Neeraj Sir", expertise: "Quant / LRDI", image: imgNeeraj },
  // Avinash Sir mentioned in copy but no image in assets; add if available.
];

const ABOUT_TEXT = (
  <>
    Designed for beginner and intermediate level students, the classic course
    offers a comprehensive tuition and revision of <b>450 hours</b>. The
    students are taught everything from basic to most advanced concept in all
    the three major sections of B-school entrance exams — <b>QA, DILR and VARC</b>.
    The students are taught the concepts, application and testing strategies in
    all the three sections. They are rigorously tested on every topic and every
    module, thereby ensuring the best percentile in all the exams.
  </>
);

const CURRICULUM = [
  {
    title: "Foundation Classes",
    content: (
      <>
        In these classes, we take you to your very basics of school in both
        verbal and maths. Concepts such as basic algebra, basic geometry, basic
        grammar will be taught and refreshed, so that as your progress, you are
        on par with both engineering and non-engineering students.
      </>
    ),
  },
  {
    title: "Concept Classes",
    content: (
      <>
        You start moving towards the intermediate level, where you are taught
        CAT level concepts and need to apply these concepts on CAT level
        questions, and actual past years’ CAT question in each topic.
      </>
    ),
  },
  {
    title: "Post Class tests & Module Tests",
    content: (
      <>
        <p>
          After each class, you shall be writing three tests, which will gauge
          how much you have understood from that class. If you do not score well
          here, you will be made to take the concept class again. This ensures
          that every child is nurture to score the highest in the actual Exam.
        </p>
        <p>
          Once a Module is over, you shall be writing the entire module test,
          which will help you understand your proficiency level in that module.
          If you feel you need greater proficiency, you will be made to attend
          the module classes again.
        </p>
      </>
    ),
  },
  {
    title: "Assignment Zone",
    content: (
      <>
        One of the core element of preparation is discipline and consistency. To
        ensure these, at TG you are given assignments after each classes, failing
        to submit which, you shall not be allowed to attend the next class. This
        inculcates work-ethics, diligence, discipline, and focus in the student,
        ensuring 100% success in his/her endeavors.
      </>
    ),
  },
  {
    title: "1-1 Doubt Sessions",
    content: (
      <>
        TathaGat is the only institute where one-to-ones doubt sessions are not
        only ALWAYS available, but also repeatedly encouraged by the mentors.
        Students feel free to reach out to the mentors. At TathaGat all the
        mentors are full-time employees, which means that all of are always
        available for the students. This is a unique feature, not available at
        any other Institutes.
      </>
    ),
  },
  {
    title: "Sectional Tests",
    content: (
      <>
        Once you have mastered the concepts and learnt to apply them, you shall
        be writing tests of the entire section, i.e full VARC Test, full QA Test
        etc. Now you are getting battle-ready for each phase of the war. Here you
        work out your weaknesses in each section and strategize accordingly with
        your mentors.
      </>
    ),
  },
  {
    title: "CopyCATs (All INDIA Test Series) & Full Length Tests",
    content: (
      <>
        Having martialed your weaponry in all the three sections, you now enter
        the WAR-ZONE! You compete against the entire populace of aspirants at a
        real-time basis, find your relative status, improvize, strategize and
        polish your weapons for the real D-Day.
      </>
    ),
  },
  {
    title: "Group Exercises and Personal Interview",
    content: (
      <>
        Once you have aced your written exams, it is time for you to step into
        the micro arena of behavioural testing. TathaGat’s rigorous module on
        GEPIs trains you to be the most confident version of yourself. From
        presentations to essay writing to personal interviews to group
        discussions, you gain the managerial acumen of a true professional even
        before you have stepped into the B-School.
      </>
    ),
  },
  {
    title: "The 100 Percentiler Batch",
    content: (
      <>
        Every year at TathaGat we identify the most outstanding and consistent
        performers of the student community and train them with the most
        grilling questions of the CAT industry. This is the last Brahmastra
        needed to catch that elusive 100 percentile in the exam. The students
        are handpicked and mentored for an entire month (from mid October to mid
        November) with personalized sessions with the mentors. Only the best
        make it to this coveted batch.
      </>
    ),
  },
  {
    title: "OMETs (Other Management Entrance Tests)",
    content: (
      <>
        At TathaGat, we understand that CAT is the mother of all B-School exams
        and that once you have prepared for CAT you have dived to the deepest end
        of the pool. And yet, we understand that other exams like XAT, SNAP,
        NMAT, GMAT etc. need some additional hand-holding and strategization.
        Accordingly, we teach you the finer nuances of EACH exam separately for
        you to ace them. For example, the Decision Making sessions are designed
        to deal with the most dreaded section XAT. Similarly, special GK sessions
        are given to you which give you that extra edge for exams where GK
        questions are directly asked.
      </>
    ),
  },
];

const HIGHLIGHTS = [
  "450+ hrs of Live Classes",
  "Basic Maths Classes",
  "1000+ hrs of recordings",
  "550+ Tests",
  "Complete Study Material",
  "Current Affair, GK & Vocab Classes",
  "OMET Classes",
  "30,000 Questions",
  "24 x 7 doubt sessions",
  "Unlimited 1-to-1 Doubts",
];

const TESTS = [
  "350+ Post Class Tests",
  "50+ Module Tests",
  "45 Sectional Tests",
  "30 Copy CATs (Mock Tests)",
  "10 Copy SNAP",
  "10 Copy XAT",
  "10 Copy NMAT",
  "10 Copy MHCET",
  "10 Copy CMAT",
  "10 Copy MyCAT",
  "10 Copy Tiss",
];

const PRINTED = [
  "88 books (22 compendiums)",
  "IIM Arithmetic Primer - 400 Questions",
  "IIM Geometry Primer - 400 Questions",
  "IIM Algebra Primer - 400 Questions",
  "IIM Number System Primer - 150 Questions",
  "IIM LR DI Primer - 100 sets",
  "IIM RC Primer - 100 sets",
];

const ADDITIONAL = [
  "10 Full Day Workshop - 8hrs each",
  "Live Essay writing + WAT Sessions",
  "Topper's Batch (for selected students only)",
  "Application classes",
  "Video Solutions of PYQs",
  "OMET Classes",
  "Daily Questions",
];

// --------------- Component ---------------
const ClassicOMETOfflinePage = () => {
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const overviewRef = useRef(null);
  const curriculumRef = useRef(null);
  const instructorRef = useRef(null);
  const reviewsRef = useRef(null);

  // ratings (visual only)
  const ratings = { 5: 5, 4: 0.2, 3: 0.1, 2: 0.08, 1: 0.04 };
  const total = Object.values(ratings).reduce((a, b) => a + b, 0);
  const avgRaw =
    total &&
    Object.entries(ratings).reduce(
      (s, [star, cnt]) => s + Number(star) * cnt,
      0
    ) / total;
  const displayAvg = Math.ceil((avgRaw || 0) * 10) / 10;
  const starFill = ((avgRaw || 0) / 5) * 100;

  const course =
    location.state || {
      name: "CAT 2026 - Classic + OMET [OFFLINE]",
      price: 65000,
      oldPrice: 80000,
      video:
        "https://www.youtube.com/watch?v=3TxFxoiq8Ho",
    };

  const handleTabClick = (key) => {
    setActiveTab(key);
    const map = {
      overview: overviewRef.current,
      curriculum: curriculumRef.current,
      instructor: instructorRef.current,
      reviews: reviewsRef.current,
    };
    const el = map[key];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // update active tab on scroll
  useEffect(() => {
    const sections = [
      { key: "overview", el: overviewRef.current },
      { key: "curriculum", el: curriculumRef.current },
      { key: "instructor", el: instructorRef.current },
      { key: "reviews", el: reviewsRef.current },
    ].filter((s) => s.el);

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) {
          const m = sections.find((s) => s.el === vis.target);
          if (m && m.key !== activeTab) setActiveTab(m.key);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    sections.forEach((s) => obs.observe(s.el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cocp-page container">
      <div className="row">
        {/* LEFT */}
        <div className="cocp-left col-lg-9">
          {/* Video */}
          <div className="cocp-video">
            <iframe
              width="100%"
              height="600"
              src={course.video}
              title="Course Intro"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Title */}
          <h2 className="cocp-title">{course.name}</h2>

          {/* Info grid */}
          <div className="cocp-info-grid">
            <div className="cocp-info-item">
              <span className="cocp-ico">👨‍🏫</span>
              <div>
                <div className="cocp-label">Instructors</div>
                <div className="cocp-val">
                  Kumar Sir, Manish Sir, Neeraj Sir, Avinash Sir
                </div>
              </div>
            </div>
            <div className="cocp-info-item">
              <span className="cocp-ico">📚</span>
              <div>
                <div className="cocp-label">Category</div>
                <div className="cocp-val">CAT</div>
              </div>
            </div>
            <div className="cocp-info-item">
              <span className="cocp-ico">⏱️</span>
              <div>
                <div className="cocp-label">No of Hours</div>
                <div className="cocp-val">450 Hours</div>
              </div>
            </div>
            <div className="cocp-info-item">
              <span className="cocp-ico">⭐</span>
              <div>
                <div className="cocp-label">Review</div>
                <div className="cocp-val">4.9 (Google)</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="cocp-tabs" ref={overviewRef}>
            <div className="cocp-tab-buttons">
              <button
                className={`cocp-tab-btn ${
                  activeTab === "overview" ? "active" : ""
                }`}
                onClick={() => handleTabClick("overview")}
              >
                📘 Overview
              </button>
              <button
                className={`cocp-tab-btn ${
                  activeTab === "curriculum" ? "active" : ""
                }`}
                onClick={() => handleTabClick("curriculum")}
              >
                📄 Curriculum
              </button>
              <button
                className={`cocp-tab-btn ${
                  activeTab === "instructor" ? "active" : ""
                }`}
                onClick={() => handleTabClick("instructor")}
              >
                👤 Instructors
              </button>
              <button
                className={`cocp-tab-btn ${
                  activeTab === "reviews" ? "active" : ""
                }`}
                onClick={() => handleTabClick("reviews")}
              >
                ⭐ Reviews
              </button>
            </div>

            {/* Overview content */}
            <div className="cocp-tab-content">
              <h3>About The Course</h3>
              <p>{ABOUT_TEXT}</p>
            </div>
          </div>

          {/* Curriculum */}
          <div className="cocp-curriculum" ref={curriculumRef}>
            <h3>Course Curriculum</h3>
            {CURRICULUM.map((item, idx) => (
              <div
                key={idx}
                className={`cocp-curriculum-item ${
                  openIndex === idx ? "active" : ""
                }`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <div className="cocp-curriculum-title">
                  {item.title}
                  <span className="cocp-arrow">
                    {openIndex === idx ? "▾" : "▸"}
                  </span>
                </div>
                {openIndex === idx && (
                  <div className="cocp-curriculum-content">{item.content}</div>
                )}
              </div>
            ))}
          </div>

          {/* Instructors */}
          <div className="cocp-instructors" ref={instructorRef}>
            <h3>Meet Your Instructors</h3>
            <div className="cocp-instructor-grid">
              {INSTRUCTORS.map((ins, i) => (
                <div className="cocp-instructor-card" key={i}>
                  <div className="cocp-instructor-img">
                    <img src={ins.image} alt={ins.name} />
                  </div>
                  <div className="cocp-instructor-info">
                    <div>
                      <strong>Name -</strong> {ins.name}
                    </div>
                    <div>
                      <strong>Expertise -</strong> {ins.expertise}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="cocp-reviews" ref={reviewsRef}>
            <h3>Our Valuable Reviews</h3>
            <div className="cocp-review-layout">
              <div className="cocp-rating-summary">
                <div>
                  <div className="cocp-rating-score">
                    {displayAvg.toFixed(1)}
                  </div>
                  <div
                    className="cocp-rating-stars"
                    style={{ ["--percent"]: `${starFill}%` }}
                  >
                    <span className="cocp-stars-outer">★★★★★</span>
                    <span
                      className="cocp-stars-inner"
                      style={{ width: `${starFill}%` }} // fallback
                    >
                      ★★★★★
                    </span>
                  </div>
                  <p className="cocp-total-rating">1,932 reviews</p>
                </div>

                <div className="cocp-rating-bars">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div className="cocp-bar-line" key={star}>
                      <span className="cocp-star">☆</span> <span>{star}</span>
                      <div className="cocp-bar">
                        <div
                          className="cocp-fill"
                          style={{
                            width: `${
                              total
                                ? ((ratings[star] || 0) / total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cocp-review-image-box">
                <img src={reviewMain} alt="Review Summary" />
              </div>
            </div>

            <div className="cocp-reviews-gallery">
              <img src={review3} alt="Student Review 3" />
              <img src={review4} alt="Student Review 4" />
              <img src={review6} alt="Student Review 6" />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="cocp-right col-md-3">
          <div className="cocp-course-info">
            <div className="cocp-course-title">
              CAT 2026 - Classic + OMET [OFFLINE]
            </div>

            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                marginBottom: 12,
                color: "#1A237E",
              }}
            >
              Price:
              <span style={{ color: "#D32F2F", marginLeft: 6 }}>
                ₹{(course.price ?? 65000).toLocaleString("en-IN")}/-
              </span>
              <span
                style={{
                  marginLeft: 8,
                  color: "#9E9E9E",
                  textDecoration: "line-through",
                }}
              >
                ₹{(course.oldPrice ?? 80000).toLocaleString("en-IN")}/-
              </span>
            </div>

            <div className="cocp-desc-scroll">
              <ul className="cocp-material-list">
                {HIGHLIGHTS.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>

            {/* Open in new tab */}
            <button
              className="cocp-buy-btn"
              onClick={() =>
                window.open(RAZORPAY_URL, "_blank", "noopener,noreferrer")
              }
            >
              Buy Now
            </button>
            
            <a
              href="https://wa.me/919205534439?text=Hello%20Tathagat%20Team,%20I%20want%20to%20talk%20to%20a%20counsellor."
              target="_blank"
              rel="noopener noreferrer"
              className="cocp-counsellor-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#ff9523",
                color: "#fff",
                fontSize: "16px",
                padding: "12px",
                fontWeight: "600",
                borderRadius: "8px",
                marginTop: "10px",
                textDecoration: "none",
                transition: "0.3s",
                width: "100%",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Talk to Counsellor
            </a>
          </div>


          <div className="cocp-material-box">
            <h4>Printed Study Material</h4>
            <ul className="cocp-material-list">
              {PRINTED.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="cocp-material-box">
            <h4>Additional Features</h4>
            <ul className="cocp-material-list">
              {ADDITIONAL.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Chatbox/>
    </div>
  );
};

export default ClassicOMETOfflinePage;
