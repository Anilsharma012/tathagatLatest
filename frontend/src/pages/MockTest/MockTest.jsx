import React, { useMemo, useState, useEffect, useRef } from "react";
import "./MockTest.css";
import team from "../../images/contactTeams.png";
import { useNavigate, useLocation } from "react-router-dom";
import Chatbox from "../../components/Chat/Chatbox";
import axios from "axios";
import http from "../../utils/http";

const API_BASE = "/api/downloads";

const MockTest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState({
    PREVIOUS_YEAR: [],
    TOPIC_WISE: [],
  });
  const [previousYearTests, setPreviousYearTests] = useState([]);
  const [topicWiseTests, setTopicWiseTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);

  const [activeTab, setActiveTab] = useState("quant");
  const [activeCat, setActiveCat] = useState("all");
  const [topicFilter, setTopicFilter] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchTests();
  }, []);

  useEffect(() => {
    if (categories.TOPIC_WISE.length > 0 && !topicFilter) {
      setTopicFilter(categories.TOPIC_WISE[0]._id);
    }
  }, [categories.TOPIC_WISE, topicFilter]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/public/categories`);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTests = async () => {
    try {
      setLoadingTests(true);
      const [testsRes, freeMockRes] = await Promise.all([
        axios.get(`${API_BASE}/public/tests`),
        axios.get(`${API_BASE}/public/free-mock-tests`)
      ]);
      
      let allPreviousYearTests = [];
      let allTopicWiseTests = [];
      
      if (testsRes.data.success) {
        const tests = testsRes.data.tests;
        allPreviousYearTests = tests.filter((t) => t.type === "PREVIOUS_YEAR");
        allTopicWiseTests = tests.filter((t) => t.type === "TOPIC_WISE");
      }
      
      if (freeMockRes.data.success) {
        freeMockRes.data.tests.forEach(test => {
          const formattedTest = {
            ...test,
            type: test.downloadType || "PREVIOUS_YEAR",
            categoryId: test.categoryId || null
          };
          
          if (test.downloadType === "TOPIC_WISE") {
            allTopicWiseTests.push(formattedTest);
          } else {
            allPreviousYearTests.push(formattedTest);
          }
        });
      }
      
      setPreviousYearTests(allPreviousYearTests);
      setTopicWiseTests(allTopicWiseTests);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoadingTests(false);
    }
  };

  const examFilteredTests = useMemo(() => {
    if (activeCat === "all") return previousYearTests;
    return previousYearTests.filter(
      (t) => t.categoryId?._id === activeCat || t.categoryId === activeCat,
    );
  }, [activeCat, previousYearTests]);

  const topicFilteredTests = useMemo(() => {
    if (!topicFilter) return topicWiseTests;
    return topicWiseTests.filter(
      (t) => t.categoryId?._id === topicFilter || t.categoryId === topicFilter,
    );
  }, [topicFilter, topicWiseTests]);

  const handleAttemptTest = (test) => {
    if (test.status === "COMING_SOON") return;

    const token =
      localStorage.getItem("token") || localStorage.getItem("studentToken");
    if (!token) {
      navigate("/Login", {
        state: { from: location.pathname, testId: test._id },
      });
      return;
    }

    if (test.pdfUrl) {
      window.open(test.pdfUrl, "_blank");
    } else if (test.isMockTest) {
      navigate(`/student/mock-test/${test._id}/instructions`);
    } else {
      navigate("/instruction", { state: { testId: test._id } });
    }
  };

  const goToContact = () => navigate("/GetInTouch");

  const videosRef = useRef(null);
  useEffect(() => {
    const el = videosRef.current;
    if (!el) return;

    const items = el.querySelectorAll(".video");
    if (!items.length) return;

    let paused = false;
    let timer = null;

    const computeStep = () => {
      const list = el.querySelectorAll(".video");
      if (list.length >= 2) {
        return list[1].offsetLeft - list[0].offsetLeft;
      }
      const style = getComputedStyle(el);
      const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
      return (list[0]?.clientWidth || 0) + gap;
    };

    const tick = () => {
      if (paused) return;
      const step = computeStep();
      if (step <= 0) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      let next = el.scrollLeft + step;
      if (next >= maxScroll - 1) next = 0;
      el.scrollTo({ left: next, behavior: "smooth" });
    };

    const start = () => {
      stop();
      timer = setInterval(tick, 3000);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
    };

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);

    start();
    return () => {
      stop();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  const [guide, setGuide] = useState({
    name: "",
    phone: "",
    email: "",
    program: "CAT & OMET",
    mode: "online",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjkaajbr";

  const submitGuide = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("Sending...");

    try {
      await http.post('/crm/leads/enquiry', {
        name: guide.name,
        mobile: guide.phone,
        email: guide.email,
        courseInterest: guide.program,
        message: `Mode: ${guide.mode}`,
        formType: 'guide_form',
        page: 'MockTest'
      });
      
      const data = new FormData();
      data.append("name", guide.name);
      data.append("phone", guide.phone);
      data.append("email", guide.email);
      data.append("program", guide.program);
      data.append("mode", guide.mode);
      data.append("source", "MockTest page");
      data.append(
        "_subject",
        `Guidance request - ${guide.program} (${guide.mode}) - ${guide.name}`,
      );
      data.append("_replyto", guide.email);
      data.append("_format", "plain");
      data.append("_gotcha", "");

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      let j = {};
      try {
        j = await res.json();
      } catch {}

      if (res.ok) {
        setStatus("Submitted! We'll contact you shortly.");
        alert("Submitted! We'll contact you shortly.");
        setGuide({
          name: "",
          phone: "",
          email: "",
          program: "CAT & OMET",
          mode: "online",
        });
      } else {
        const msg = `Failed (status ${res.status}) ${j.error || ""}`;
        setStatus(msg);
        alert(msg);
      }
    } catch (err) {
      const msg = `Network error: ${String(err)}`;
      setStatus(msg);
      alert(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div id="page1">
        <div className="mock-container">
          <div className="mock-left">
            <p className="tagline">CRACK THE CAT. UNLOCK YOUR DREAM B-School</p>
            <h1 className="heading">
              PAST YEARS' PAPERS
              <br />
              FOR DOWNLOAD
            </h1>
            <p className="description">
              You can download these papers or attempt them 'here' itself.
            </p>

            <p className="success-title">The success stories</p>

            <div className="videos" ref={videosRef}>
              <div className="video">
                <iframe
                  src="https://www.youtube.com/embed/uENlBxSGf-Q?rel=0&modestbranding=1"
                  title="Success Story 1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>

              <div className="video">
                <iframe
                  src="https://www.youtube.com/embed/OcJId_ai8uY?rel=0&modestbranding=1"
                  title="Success Story 2"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>

              <div className="video">
                <iframe
                  src="https://www.youtube.com/embed/MOqCTCPKma4?rel=0&modestbranding=1"
                  title="Success Story 3"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>

              <div className="video">
                <iframe
                  src="https://www.youtube.com/embed/KybGz3L5R3A?rel=0&modestbranding=1"
                  title="Success Story 4"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="mock-right">
            <h2>Let us guide you!</h2>
            <form className="form-box" onSubmit={submitGuide}>
              <input
                type="text"
                name="_gotcha"
                style={{ display: "none" }}
                onChange={() => {}}
              />

              <input
                type="text"
                placeholder="Name"
                name="name"
                value={guide.name}
                onChange={(e) => setGuide({ ...guide, name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="+91 90197 64495"
                name="phone"
                value={guide.phone}
                onChange={(e) => setGuide({ ...guide, phone: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={guide.email}
                onChange={(e) => setGuide({ ...guide, email: e.target.value })}
                required
              />
              <select
                name="program"
                value={guide.program}
                onChange={(e) =>
                  setGuide({ ...guide, program: e.target.value })
                }
                required
              >
                <option value="CAT & OMET">CAT & OMET</option>
                <option value="OMET">OMET</option>
                <option value="IPMAT/CUET">IPMAT/CUET</option>
                <option value="GMAT">GMAT</option>
              </select>
              <select
                name="mode"
                value={guide.mode}
                onChange={(e) => setGuide({ ...guide, mode: e.target.value })}
                required
              >
                <option value="online">Online</option>
                <option value="Offline">Offline</option>
              </select>
              <button type="submit" disabled={sending}>
                {sending ? "Submitting..." : "Submit"}
              </button>

              {status && (
                <p style={{ marginTop: 8, textAlign: "center", color: "#000" }}>
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* <section className="iim-logos-section">
        <h2 className="iim-section-title">CAT 2025</h2>
        <div className="iim-logos-container">
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-a">IIM A</div>
            <span>AHMEDABAD</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-amr">IIM</div>
            <span>AMRITSAR</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-b">IIM B</div>
            <span>BANGALORE</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-bg">IIM BG</div>
            <span>BODH GAYA</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-c">IIM C</div>
            <span>CALCUTTA</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-j">IIM J</div>
            <span>JAMMU</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-k">IIM K</div>
            <span>KASHIPUR</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-ko">IIM KO</div>
            <span>KOZHIKODE</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-l">IIM L</div>
            <span>LUCKNOW</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-m">IIM M</div>
            <span>MUMBAI</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-n">IIM N</div>
            <span>NAGPUR</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-r">IIM R</div>
            <span>RANCHI</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-s">IIM S</div>
            <span>SAMBALPUR</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-i">IIM I</div>
            <span>INDORE</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-ro">IIM RO</div>
            <span>ROHTAK</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-sr">IIM SR</div>
            <span>SIRMAUR</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-t">IIM T</div>
            <span>TIRUCHIRAPPALLI</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-u">IIM U</div>
            <span>UDAIPUR</span>
          </div>
          <div className="iim-logo-item">
            <div className="iim-logo-circle iim-v">IIM V</div>
            <span>VISAKHAPATNAM</span>
          </div>
        </div>
      </section> */}


      <section className="cat-mock-container">
        <h1 className="page-title">Previous Years' Papers</h1>

        <div className="tgv-scroll-wrapper">
          <div className="filter-buttons">
            <button
              className={activeCat === "all" ? "active" : ""}
              onClick={() => setActiveCat("all")}
            >
              CATEGORIES
            </button>
            {categories.PREVIOUS_YEAR.map((c) => (
              <button
                key={c._id}
                className={activeCat === c._id ? "active" : ""}
                onClick={() => setActiveCat(c._id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="test-grid">
          {loadingTests ? (
            <div className="loading-message">Loading tests...</div>
          ) : examFilteredTests.length === 0 ? (
            <div className="empty-message">No tests available yet.</div>
          ) : (
            examFilteredTests.map((test) => (
              <div
                key={test._id}
                className={`test-card ${test.status === "COMING_SOON" ? "is-soon" : ""}`}
              >
                {test.status === "COMING_SOON" && (
                  <div
                    className="soon-overlay"
                    role="status"
                    aria-label="Coming soon"
                  >
                    <div className="soon-pill">COMING SOON</div>
                  </div>
                )}

                <div className="card-inner">
                  <div className="test-header">
                    <div className="labels">
                      {test.isFree && <span className="label free">Free</span>}
                      <span className="label must">Must Attempt</span>
                    </div>

                    <button
                      className="attempt-btn"
                      onClick={() => handleAttemptTest(test)}
                      disabled={test.status === "COMING_SOON"}
                      aria-disabled={test.status === "COMING_SOON"}
                      title={
                        test.status === "COMING_SOON"
                          ? "Coming soon"
                          : "Attempt Now"
                      }
                    >
                      {test.pdfUrl ? "Download" : "Attempt Now"}
                    </button>
                  </div>

                  <h3 className="test-title">{test.title}</h3>

                  <div className="test-meta">
                    <span>{test.questionCount} Questions</span>
                    <span>{test.totalMarks} Marks</span>
                    <span>{test.durationMinutes} Minutes</span>
                  </div>

                  <div className="footer">{test.language || "English"}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="syllabus-container">
        <div className="syllabus-left">
          <h1 className="syllabus-title">CAT 2026 Syllabus</h1>

          <div className="syllabus-tabs-wrapper">
            <div className="syllabus-tabs">
              <button
                className={`tab ${activeTab === "quant" ? "active" : ""}`}
                onClick={() => setActiveTab("quant")}
              >
                CAT 2026 QUANT Syllabus
              </button>
              <button
                className={`tab ${activeTab === "varc" ? "active" : ""}`}
                onClick={() => setActiveTab("varc")}
              >
                CAT 2026 VARC Syllabus
              </button>
              <button
                className={`tab ${activeTab === "dilr" ? "active" : ""}`}
                onClick={() => setActiveTab("dilr")}
              >
                CAT 2026 DILR Syllabus
              </button>
            </div>
          </div>

          {activeTab === "quant" && (
            <>
              <h3 className="section-title">
                Quant Section in CAT - Topic wise question distribution
              </h3>
              <div className="responsive-table-container">
                <table className="syllabus-table">
                  <thead>
                    <tr>
                      <th>Topic</th>
                      <th>CAT 2022</th>
                      <th>CAT 2023</th>
                      <th>CAT 2024</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Averages, Ratio & Proportion</td>
                      <td>5</td>
                      <td>3</td>
                      <td>4</td>
                    </tr>
                    <tr>
                      <td>Profit and Loss, Interest</td>
                      <td>3</td>
                      <td>2</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>Time, Distance and Work</td>
                      <td>1</td>
                      <td>2</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>Quadratic & Polynomial Equations</td>
                      <td>1</td>
                      <td>2</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>Linear Equations & Inequalities</td>
                      <td>2</td>
                      <td>3</td>
                      <td>3</td>
                    </tr>
                    <tr>
                      <td>Logarithms, Surds & Indices</td>
                      <td>1</td>
                      <td>0</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>Geometry & Mensuration</td>
                      <td>3</td>
                      <td>2</td>
                      <td>3</td>
                    </tr>
                    <tr>
                      <td>Number Systems</td>
                      <td>3</td>
                      <td>2</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>Progressions and Series</td>
                      <td>1</td>
                      <td>1</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>Functions and Graphs</td>
                      <td>1</td>
                      <td>0</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>Probability & Combinatorics</td>
                      <td>1</td>
                      <td>1</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "varc" && (
            <>
              <h3 className="section-title">
                VARC Section in CAT - Topic wise question distribution
              </h3>
              <div className="responsive-table-container">
                <table className="syllabus-table">
                  <tbody>
                    <tr>
                      <td>Reading Comprehension</td>
                      <td>10</td>
                      <td>12</td>
                      <td>11</td>
                    </tr>
                    <tr>
                      <td>Para Jumbles</td>
                      <td>2</td>
                      <td>1</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>Para Summary</td>
                      <td>1</td>
                      <td>2</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>Odd One Out</td>
                      <td>1</td>
                      <td>1</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>Grammar/Vocab</td>
                      <td>1</td>
                      <td>0</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>Critical Reasoning</td>
                      <td>3</td>
                      <td>2</td>
                      <td>3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "dilr" && (
            <>
              <h3 className="section-title">
                DILR Section in CAT - Topic wise Sets distribution
              </h3>
              <div className="responsive-table-container">
                <table className="syllabus-table">
                  <tbody>
                    <tr>
                      <td>Bar Graph + Tables</td>
                      <td>1</td>
                      <td>2</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>Seating Arrangement</td>
                      <td>2</td>
                      <td>1</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>Games & Tournaments</td>
                      <td>1</td>
                      <td>1</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>Matrix Arrangement</td>
                      <td>1</td>
                      <td>0</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>Venn/Set Based</td>
                      <td>1</td>
                      <td>1</td>
                      <td>1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="syllabus-right">
          <div className="trust-box">
            <div className="mentors">
              <img src={team} alt="Mentors" />
            </div>
            <div className="trust-content">
              <h3>Why Students Trust TathaGat</h3>
              <p className="trust-desc">
                Since 2007, TathaGat has helped thousands crack exams like CAT,
                XAT, GMAT, and SNAP with expert mentors, concept-focused
                learning, and personalized guidance in small batches.
              </p>
              <ul className="side-benefits">
                <li>Personalized Attention</li>
                <li>Concept-driven class</li>
                <li>Practice Session</li>
                <li>Doubts And Discussion</li>
                <li>Mentors With 99+ Percentiles</li>
                <li>Real-Time Strategy</li>
                <li>Workshops</li>
              </ul>
              <div className="support-box">
                <h4>24*7 Support</h4>
                <p>
                  TathaGat offers unlimited one-on-one doubt sessions, live
                  class doubt resolution, and round-the-clock assistance,
                  ensuring no query goes unanswered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cat-mock-container">
        <h1 className="page-title">Topic-Wise Previous Years' Questions</h1>

        <div className="filter-buttons-wrapper">
          <div className="filter-buttons">
            {categories.TOPIC_WISE.map((t) => (
              <button
                key={t._id}
                className={topicFilter === t._id ? "active" : ""}
                onClick={() => setTopicFilter(t._id)}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="test-grid">
          {loadingTests ? (
            <div className="loading-message">Loading tests...</div>
          ) : topicFilteredTests.length === 0 ? (
            <div className="empty-message">
              No topic-wise tests available yet.
            </div>
          ) : (
            topicFilteredTests.map((test) => (
              <div
                key={test._id}
                className={`test-card ${test.status === "COMING_SOON" ? "is-soon" : ""}`}
              >
                {test.status === "COMING_SOON" && (
                  <div
                    className="soon-overlay"
                    role="status"
                    aria-label="Coming soon"
                  >
                    <div className="soon-pill">COMING SOON</div>
                  </div>
                )}

                <div className="card-inner">
                  <div className="test-header">
                    <div className="labels">
                      {test.isFree && <span className="label free">Free</span>}
                      <span className="label must">Must Attempt</span>
                    </div>
                    <button
                      className="attempt-btn"
                      onClick={() => handleAttemptTest(test)}
                      disabled={test.status === "COMING_SOON"}
                      aria-disabled={test.status === "COMING_SOON"}
                      title={
                        test.status === "COMING_SOON"
                          ? "Coming soon"
                          : "Attempt Now"
                      }
                    >
                      {test.pdfUrl ? "Download" : "Attempt Now"}
                    </button>
                  </div>

                  <h3 className="test-title">{test.title}</h3>
                  <div className="test-meta">
                    <span>{test.questionCount} Questions</span>
                    <span>{test.totalMarks} Marks</span>
                    <span>{test.durationMinutes} Minutes</span>
                  </div>
                  <div className="footer">{test.language || "English"}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
  <div className="cat-info-container">
        <div className="tm-left-section">
          <section className="section">
            <h2>What is CAT?</h2>
            <p>
              The Common Admission Test (CAT) is India’s most prestigious management entrance exam, conducted annually by
              the Indian Institutes of Management (IIMs). It is the gateway to more than 20 IIMs and hundreds of top-tier
              B-Schools like FMS Delhi, MDI Gurgaon, SPJIMR Mumbai, and IMT Ghaziabad.
            </p>
            <p>
              CAT tests your aptitude in areas that are critical for success in management — logical reasoning,
              quantitative thinking, verbal skills, and data interpretation. It doesn’t just measure academic knowledge; it
              evaluates decision-making under time pressure — a crucial skill for future managers.
            </p>
          </section>

          <section className="section">
            <h2>Why CAT Matters</h2>
            <div className="benefits">
              <div className="benefit-box">
                🎓 Gateway to Top B-Schools:<br />
                <span>CAT scores are accepted by 1000+ institutions including all IIMs.</span>
              </div>
              <div className="benefit-box">
                💼 Lucrative Career Paths:<br />
                <span>B-school placements lead to high-paying roles in consulting, finance, marketing, and leadership.</span>
              </div>
              <div className="benefit-box">
                🌐 National Recognition:<br />
                <span>CAT scores are trusted across India as a standard of excellence.</span>
              </div>
              <div className="benefit-box">
                🚀 Life-Changing Opportunity:<br />
                <span>
                  A good CAT score can open doors to premier education, global networking, and leadership training.
                </span>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Why Solve CAT Previous Year Papers?</h2>
            <p>
              Solving CAT previous year papers is one of the most effective strategies for facing the exam. These papers
              provide a real-time glimpse into the exam’s structure, difficulty level, and question trends, helping
              aspirants develop familiarity with the actual CAT format. They allow students to identify recurring
              concepts, high-weightage topics, and the level of logical reasoning expected by the examiners.
            </p>
            <p>
              More importantly, attempting these papers under timed conditions builds crucial exam temperament—enhancing
              speed, accuracy, and time management. Post-analysis of previous year questions also helps uncover weak
              areas, refine problem-solving strategies, and boost confidence.
            </p>
          </section>

          <section className="section">
            <h2>Mock Tests: Your Key to CAT Success</h2>
            <p>
              Mock tests play a critical role in CAT preparation. They replicate the actual exam environment, helping
              students build endurance, manage time efficiently, and test conceptual clarity. Attempting full-length mocks
              and section-wise tests regularly enables aspirants to experiment with different strategies and find what
              works best.
            </p>
            <p>
              Detailed performance analysis after each mock test helps track progress, identify gaps, and fine-tune
              preparation. It’s not just about practice—mock tests train the mind to stay sharp, calm, and confident under
              pressure.
            </p>
          </section>
        </div>

        <div className="tm-right-section">
          <div className="ta-course-card">
            <h3>
              CAT 2026
              <br />
              Advance Course
            </h3>
            <ul className="ta-highlights">
              <li>700 hrs Live Classes</li>
              <li>LOD 1, 2 3 & other</li>
              <li>24 x 7 Doubt solving</li>
              <li>50 Mocks on OMETs with complete solution</li>
              <li>30 Mocks tests with complete solution</li>
              <li>45 sectional Tests with complete solutions</li>
              <li>Printed books</li>
            </ul>
            <div className="course-buttons">
              {/* ✅ Both buttons now go to /GetInTouch */}
              <button className="enquire-btn" onClick={goToContact}>
               Enquiry Form
              </button>
              <button className="proceed-btn" onClick={goToContact}>
                Checkout Page
              </button>
            </div>
          </div>

          <div className="series-list">
            <h4>Other Packages</h4>
            <ul>
              <li>CAT + OMET 2025/2026 ONLINE COURSE </li>
              <li>CAT + OMET 2025/2026 OFFLINE COURSE </li>
              <li>WORKSHOPS</li>
              <li>TEST SERIES</li>
              <li>BOOKS + TEST SERIES</li>
            </ul>
          </div>
        </div>
      </div>

      <Chatbox />
    </>
  );
};

export default MockTest;
 