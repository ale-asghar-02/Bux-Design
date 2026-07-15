import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../features/portfolio/components/ProjectCard";

import { useTextAnimation, useHeadingAnimation } from "../hooks/useTextAnimation";
import usePortfolio from "../features/portfolio/hooks/usePortfolio";
import useBlog from "../features/blog/hooks/useBlog";
import useReview from "../features/review/hooks/useReview";

import { getPublicProfile } from "../features/dashboard/services/dashboardAPI";

import menuBarBgBlack from "../assets/images/menu-bar-bg.svg";
import menuBarBgWhite from "../assets/images/menu-bar-white-bg.svg";
import logoWhite from "../assets/images/white-logo.svg";
import linkedInIcon from "../assets/icons/linkedIn-icon.svg";
import dribbleIcon from "../assets/icons/dribble-icon.svg";
import behanceIcon from "../assets/icons/behance-icon.svg";
import starIcon from "../assets/icons/star.png";
import servicesRightIcon from "../assets/icons/services-right-icon.svg";
import textStarImg from "../assets/icons/star-icon.svg";
import headerImg from "../assets/images/hero-bg.svg";
import reviewDoubleQuote from "../assets/icons/review-double-quote.svg"

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { logout } from "../features/auth/services/authAPI";

const servicesData = [
  {
    id: 1,
    heading: "UI/UX Design",
    items: ["Web Design", "Responsive Design", "App Design", "User Research"],
  },
  {
    id: 2,
    heading: "Mobile App\nDesigning",
    items: [
      "User-centered Design",
      "Platform Compatibility",
      "Gestural Interfaces",
      "Accessibility",
    ],
  },
  {
    id: 3,
    heading: "Design Audit",
    items: [
      "Usability Evaluation",
      "Design Consistency",
      "Performance Analysis",
      "Competitor Analysis",
    ],
  },
  {
    id: 4,
    heading: "Interactive Design\nPrototyping",
    items: [
      "Interactive Wireframing",
      "User Testing",
      "Web Design",
      "Iterative Design Process",
    ],
  },
  {
    id: 5,
    heading: "Design &\nBranding",
    items: [
      "Brand Identity",
      "Brand Guidelines",
      "Visual Storytelling",
      "Brand Strategy",
    ],
  },
];

import dribbleImg from "../assets/images/dribble.svg";
import heartImg from "../assets/images/ph_heart-fill.svg";
import leaveImg from "../assets/images/leaves.svg";

const textAnimation = [
  { type: "text", value: '"In the dynamic landscape of product design ' },
  { type: "image", src: dribbleImg, alt: "dribble" },
  {
    type: "text",
    value: "our journey is a symphony of form, function, and elegance—a legacy",
  },
  {
    type: "image",
    src: heartImg,
    alt: "heart",
  },
  {
    type: "text",
    value: "that resonates through generations of inspired design",
  },
  { type: "image", src: leaveImg, alt: "leaves" },
];

const Home = () => {
  // ===== Hooks & Context =====
  const navigate = useNavigate();

  // ===== Data Fetching =====
  const { portfolios, handleGetAllPortfolios } = usePortfolio();
  const { blogs, handleGetAllBlogs } = useBlog();
  const { reviews, handleGetAllReviews } = useReview();

  // ===== Text Animations =====
  const { textRef, textAnimate, processed } = useTextAnimation( textAnimation, 60 );
  const { headingAnimate, words } = useHeadingAnimation( "I'M BILAWAL PARACHA a Product Designer", 80 );

  // ===== UI State =====
  const [isOpen, setIsOpen] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [selected, setSelected] = useState("all");
  const [profile, setProfile] = useState(null);
  const [slideActiveReviews, setSlideActiveReviews] = useState([]);

  // ===== Initial Data Load =====
  useEffect(() => {
    handleGetAllPortfolios();
    handleGetAllBlogs();
    handleGetAllReviews();
  }, []);

  // ===== Bootstrap Dropdown Close Listener =====
  useEffect(() => {
    const handleHide = () => setIsSort(false);
    document.addEventListener("hide.bs.dropdown", handleHide);
    return () => document.removeEventListener("hide.bs.dropdown", handleHide);
  }, []);

  // ===== Derived Data: Filtered Portfolios =====
  const filteredPortfolios = portfolios.filter((item) => {
    if (selected === "all") return true;
    return item.field?.toLowerCase() === selected.toLowerCase();
  });

  // ===== Derived Data: Review Slides =====
  const chunkReviews = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size)
      chunks.push(arr.slice(i, i + size));
    return chunks;
  };

  const approvedReviews = reviews.filter(
    (item) => item.status?.toLowerCase() === "approved"
  );

  const latestReviews = [...approvedReviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 35);

  const reviewSlides = chunkReviews(latestReviews, 7);

  useEffect(() => {
    if (latestReviews.length > 0) {
      setSlideActiveReviews(
        reviewSlides.map((slide) => ({
          active: slide[0],
          left: [slide[1], slide[2], slide[3]].filter(Boolean),
          right: [slide[4], slide[5], slide[6]].filter(Boolean),
        })),
      );
    }
  }, [reviews]);

  // ===== Handlers: Reviews / Avatars =====
  const handleAvatarClick = (slideIndex, clickedReview, side, avatarIndex) => {
    setSlideActiveReviews((prev) => {
      const updated = [...prev];
      const current = { ...updated[slideIndex] };
      const prevActive = current.active;

      if (side === "left") {
        const newLeft = [...current.left];
        newLeft[avatarIndex] = prevActive;
        current.left = newLeft;
      } else {
        const newRight = [...current.right];
        newRight[avatarIndex] = prevActive;
        current.right = newRight;
      }

      current.active = clickedReview;
      updated[slideIndex] = current;
      return updated;
    });
  };

  // ===== Handlers: Social Profile Links =====
  const openLink = (url) => { if (url) window.open(url, "_blank", "noreferrer") };

  const loadProfile = async () => {
    if (!profile) {
      const data = await getPublicProfile();
      setProfile(data);
      return data;
    }
    return profile;
  };

  const handleLink = async (key) => {
    const data = await loadProfile();
    if (data?.[key]) openLink(data[key]);
  };

  return (
    <div className="position-relative overflow-hidden">
      {/* ② Menu Bar */}
      <div className={`${isOpen ? "position-fixed" : "position-absolute"} top-0 end-0`} style={{ height: "calc(40vh + 20vw)", zIndex: "10" }}>
        <img
          className="menu-bg-1 h-100"
          style={{ opacity: isOpen ? 0 : 1, transform: "opacity 0.4s ease" }}
          src={menuBarBgBlack}
          alt="menu-bar-bg"
        />
        <img
          className="menu-bg-2 h-100"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: "opacity 0.4s ease",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          src={menuBarBgWhite}
          alt="menu-bar-bg"
        />
        <div
          className="menu-bar position-absolute top-50 start-50 translate-middle text-success"
          style={{ zIndex: "11" }}
        >
          <div className="menu-toggle">
            <button
              className={`bg-transparent border-0 menu ${isOpen ? "opened" : ""}`}
               onClick={() => { setIsOpen((prev) => !prev)}}
              aria-label="Main Menu"
              aria-expanded={isOpen.toString()}
              type="button"
            >
              <svg width="35" height="35" viewBox="0 0 100 100">
                <path
                  className="line line1"
                  d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
                />
                <path className="line line2" d="M 20,50 H 80" />
                <path
                  className="line line3"
                  d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ② Menu Model Open */}
      <div className={`menu-model col-12 h-100 ${isOpen ? "position-fixed open" : "position-absolute"} top-0 end-0 bg-black`}
        style={{ zIndex: "9" }}>
        <div className={`menu-content-fade ${isOpen ? "show" : ""}`}>
          <div className="container text-white py-1 py-lg-4">
            <Link to={"/"} onClick={() => { setIsOpen((prev) => !prev)}} className="navbar-brand">
              <img
                style={{ width: "calc(4rem + 2.4vw)" }}
                src={logoWhite}
                alt="Logo"
                height="50"
              />
            </Link>
            <div className="col-12">
              <div className="row">
                <div className="menu-items">
                  <Link to={"/"} onClick={() => { setIsOpen((prev) => !prev)}} className="menu-item">
                    Home
                  </Link>
                  <Link to={"/about"} className="menu-item">
                    About
                  </Link>
                  <Link to={"/portfolio"} className="menu-item">
                    Portfolio
                  </Link>
                  <Link to={"/services"} className="menu-item">
                    Services
                  </Link>
                  <Link to={"/blogs"} className="menu-item">
                    Blogs
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12 menu-nav-items px-3 mt-5 mt-md-0">
              <div className="row gap-0 column-gap-4">
                <div
                  className="menu-nav-item p-0"
                  onClick={() => handleLink("linkedIn")}
                  style={{ cursor: "pointer" }}
                >
                  <p className="mb-0 fs-5">LinkedIn</p>
                  <img
                    width={24}
                    src={linkedInIcon}
                    alt="linkedIn-icon"
                  />
                </div>
                <div
                  className="menu-nav-item p-0"
                  onClick={() => handleLink("dribbble")}
                  style={{ cursor: "pointer" }}
                >
                  <p className="mb-0 fs-5">Dribble</p>
                  <img
                    width={22}
                    src={dribbleIcon}
                    alt="dribble-icon"
                  />
                </div>
                <div
                  className="menu-nav-item p-0"
                  onClick={() => handleLink("behance")}
                  style={{ cursor: "pointer" }}
                >
                  <p className="mb-0 fs-5">Behance</p>
                  <img
                    width={22}
                    src={behanceIcon}
                    alt="behance-icon"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Navbar />
        <div className="container hero-content mb-5">
          <div className="col-12 d-flex flex-wrap align-items-center py-5">
            <div className="col-12 col-lg-8 mb-4 mb-lg-0 px-5 px-lg-0">
              <h1
                className="sub-heading d-flex flex-wrap"
                style={{
                  fontSize: "calc(1.5rem + 3vw)",
                  gap: "0.3em",
                  lineHeight: 0.8,
                }}
              >
                {words.map((word, wi) => (
                  <span key={wi} style={{ display: "inline-flex" }}>
                    {word.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-block",
                          opacity: headingAnimate ? 1 : 0,
                          transition: "opacity 0.5s ease",
                          transitionDelay: `${c.delay}ms`,
                        }}
                      >
                        {c.char}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>
            </div>
            <div className="col-12 col-lg-4 d-flex justify-content-center justify-content-lg-end">
              <div
                className="rounded-pill position-relative"
                style={{ width: "150px", height: "150px" }}
              >
                <svg
                  className="rotate-circle-text"
                  width="150"
                  height="150"
                  viewBox="0 0 150 150"
                >
                  <path
                    id="circlePath"
                    d="M 75,75 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                    fill="none"
                  />

                  <text>
                    <textPath
                      href="#circlePath"
                      className="text-uppercase fw-medium"
                      style={{ fontSize: "13px", letterSpacing: -0.5 }}
                    >
                      Application ‎ ‎ ‎ ‎ Website ‎ ‎ ‎ ‎ Application ‎ ‎ ‎ ‎
                      Dashboard ‎ ‎ ‎ ‎
                    </textPath>
                  </text>
                </svg>

                <div className="position-absolute top-50 start-50 translate-middle">
                  <img width={35} src={starIcon} />
                </div>
              </div>
            </div>
          </div>

          <div class="hero-line mb-4"></div>

          <div
            className="col-12 rounded-1 overflow-hidden"
            style={{ height: "calc(15vh + 20vw)" }}
          >
            <img
              className="col-12 h-100 object-fit-cover"
              src={headerImg}
              alt="hero-bg"
            />
          </div>
        </div>

        <div className="work-section pt-md-5 mb-5">
          <div className="container">
            <div className="text-center mb-4">
              <h1
                className="sub-heading"
                style={{ fontSize: "calc(30px + 1.5vw)" }}
              >
                Work
              </h1>
            </div>

            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center">
                <p
                  className="fw-medium mb-0 me-lg-5"
                  style={{ fontSize: "calc(14px + 0.5vw)" }}
                >
                  Projects{" "}
                  <span className="fs-6">({filteredPortfolios.length})</span>
                </p>

                <div className="dropdown ms-4 me-2 ms-lg-5 me-lg-5">
                  <button
                    className="d-flex align-items-center border rounded-2 bg-transparent px-2 py-1"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded={isSort}
                    onClick={() => setIsSort(!isSort)}
                  >
                    <span className="text-dark fw-medium small">Sort By</span>
                    <i
                      className="ti ti-chevron-right ms-2"
                      style={{
                        transition: "transform 0.3s ease",
                        transform: isSort ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    ></i>
                  </button>

                  <ul
                    className="dropdown-menu p-2 py-2 pe-3"
                    aria-labelledby="categoryDropdown"
                  >
                    {[
                      { value: "all", label: "All" },
                      { value: "website", label: "Website" },
                      { value: "mobile-app", label: "Mobile App" },
                      { value: "featured", label: "Featured" },
                    ].map((item) => (
                      <li
                        key={item.value}
                        className="mb-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(item.value);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          className="form-check-input me-2"
                          style={{ cursor: "pointer" }}
                          type="radio"
                          name="categoryFilter"
                          value={item.value}
                          checked={selected === item.value}
                          onChange={() => setSelected(item.value)}
                        />
                        <span
                          className={
                            selected === item.value ? "fw-medium" : "fw-normal"
                          }
                        >
                          {item.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <small
                  style={{ fontSize: "calc(13px + 0.2vw)" }}
                  className="fw-medium"
                >
                  Info
                </small>
              </div>
              <Link to={"/portfolio"} className="view-all-btn">
                View All
              </Link>
            </div>
          </div>

          <div className="col-12 porfolio-card d-flex flex-column gap-2">
            {filteredPortfolios.slice(0, 4).map((portfolio) => (
              <ProjectCard key={portfolio._id} portfolio={portfolio} />
            ))}
          </div>
        </div>

        <div className="services-section py-5 mb-5">
          <div className="text-center mb-5">
            <h1
              className="sub-heading text-white"
              style={{ fontSize: "calc(30px + 1.5vw)" }}
            >
              SeRviceS
            </h1>
          </div>
          <div className="col-12 pe-1 items">
            <Swiper
              pagination={{ clickable: true }}
              spaceBetween={0}
              breakpoints={{
                0: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
                1400: { slidesPerView: 5 },
              }}
            >
              {servicesData.map((service) => (
                <SwiperSlide key={service.id}>
                  <div
                    className="item"
                    onClick={() => {
                      navigate("/services");
                    }}
                  >
                    <div className="item-content">
                      <h1 className="item-heading">
                        {service.heading.split("\n").map((line, i, arr) => (
                          <span key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </h1>
                      <div className="item-dropdown">
                        <div>
                          {service.items.map((item, index) => (
                            <div
                              key={index}
                              className={`item-menu ${index < service.items.length - 1 ? "mb-2" : ""}`}
                            >
                              <div className="d-flex align-items-center">
                                <div className="icon">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    class="icon icon-tabler icons-tabler-filled icon-tabler-caret-right"
                                  >
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    />
                                    <path d="M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z" />
                                  </svg>
                                </div>
                                <div className="fw-light ms-3">
                                  <small style={{ fontSize: "16px" }}>
                                    {item}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="item-icon fs-1 my-5">
                        <img
                          width={60}
                          src={servicesRightIcon}
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="text-section">
          <div className="col-12">
            <div className="top-border px-3 d-flex gap-4 align-items-center">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="text-border"></div>
              ))}
            </div>
            <marquee>
              <p className="mb-0 p-2 py-4 text-center marquee-content">
                <span
                  style={{ width: "20px", height: "20px" }}
                  className="me-3"
                >
                  <img
                    style={{ width: "calc(18px + 0.5vw)", marginBottom: "7px" }}
                    src={textStarImg}
                    alt="star-icon"
                  />
                </span>
                In the art of design, intentionality is the brushstroke that
                creates meaning
                <span
                  style={{ width: "20px", height: "20px" }}
                  className="ms-3"
                >
                  <img
                    style={{ width: "calc(18px + 0.5vw)", marginBottom: "7px" }}
                    src={textStarImg}
                    alt="star-icon"
                  />
                </span>
              </p>
            </marquee>
            <div className="bottom-border px-3 d-flex gap-4 align-items-center">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="text-border"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="container thought-section px-lg-5 mb-5">
          <div className="px-lg-5 pb-lg-5">
            <div className="text-center mb-lg-5">
              <h1
                className="sub-heading"
                style={{ fontSize: "calc(30px + 1.5vw)" }}
              >
                Our <span className="text-line">Propaganda</span> Thoughts
              </h1>
            </div>

            <div className="text-end mb-3 mb-lg-4">
              <button
                type="button"
                onClick={() => {
                  navigate("/blogs");
                }}
                className="view-all-btn"
              >
                View All
              </button>
            </div>

            <div className="cards">
              <div className="row row-cols-1 row-cols-md-2 g-3">
                {blogs.slice(0, 4).map((blog) => (
                  <div className="col mb-lg-1" key={blog._id}>
                    <div
                      className="card overflow-hidden"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/blog-details/${blog._id}`)}
                    >
                      <div
                        className="col-12 p-2"
                        style={{ height: "calc(15vh + 15vw)" }}
                      >
                        <img
                          src={
                            blog.blogImage ||
                            "../../src/assets/images/test-image.svg"
                          }
                          className="col-12 h-100 object-fit-cover border rounded-2"
                          alt={blog.title}
                        />
                      </div>
                      <div className="card-body p-2 pt-0">
                        <p
                          style={{ fontSize: "18px" }}
                          className="card-text fw-medium mb-0"
                        >
                          {blog.title}
                        </p>
                        <p
                          style={{ fontSize: "14px" }}
                          className="card-text text-secondary fw-normal mb-0"
                        >
                          By Bux Designs -{" "}
                          {(() => {
                            const date = new Date(blog.createdAt);
                            const day = date.getDate();
                            const month = date.toLocaleDateString("en-US", {
                              month: "long",
                            });
                            const year = date.getFullYear();
                            return `${day} ${month}, ${year}`;
                          })()}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/blog-details/${blog._id}`);
                          }}
                          className="read-more-btn fw-medium mb-1"
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-2-section mb-5">
          <div className="col-12 col-lg-11 col-xl-10 px-3 py-4 p-md-5 p-lg-5">
            <h1
              ref={textRef}
              className={`text-heading ${textAnimate ? "animate" : ""}`}
            >
              {processed.map((seg, si) =>
                seg.type === "text" ? (
                  seg.chars.map(({ char, delay }, ci) => (
                    <span
                      key={`${si}-${ci}`}
                      className="fade-char"
                      style={{ "--delay": `${delay}ms` }}
                    >
                      {char}
                    </span>
                  ))
                ) : (
                  <span
                    key={`img-${si}`}
                    className="mx-2 mx-lg-3 fade-img"
                    style={{ "--delay": `${seg.delay}ms` }}
                  >
                    <img src={seg.src} alt={seg.alt} />
                  </span>
                ),
              )}
            </h1>
          </div>
        </div>

        <div className="container user-review py-lg-5" style={{ marginBottom: "calc(50px + 5vw)" }}>
          <div className="col-12 text-center mb-4 mb-lg-5">
            <h1
              className="sub-heading"
              style={{ fontSize: "calc(30px + 1.5vw)" }}
            >
              We love our clients <br /> And clients love to work with us
            </h1>
          </div>

          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            grabCursor={true}
            pagination={{
              clickable: true,
              el: ".custom-swiper-pagination",
              bulletClass: "swiper-custom-bullet",
              bulletActiveClass: "swiper-custom-bullet-active",
              renderBullet: (index, className) =>
                `<span class="${className}"></span>`,
            }}
          >
            {reviewSlides.map((_, slideIndex) => {
              const slideData = slideActiveReviews[slideIndex];
              if (!slideData) return null;
              const { active, left, right } = slideData;
              return (
                <SwiperSlide key={slideIndex}>
                  <div className="d-flex">
                    {/* Left avatars */}
                    <div className="col-12 col-md-3 d-none d-md-flex flex-column align-items-center justify-content-between">
                      <div className="ms-5">
                        <div
                          className="border rounded-pill ms-2 overflow-hidden"
                          style={{
                            width: "70px",
                            height: "70px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleAvatarClick(slideIndex, left[0], "left", 0)
                          }
                        >
                          <img
                            src={left[0]?.image}
                            alt={left[0]?.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <div className="me-5">
                        <div
                          className="border rounded-pill me-4 overflow-hidden"
                          style={{
                            width: "55px",
                            height: "55px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleAvatarClick(slideIndex, left[1], "left", 1)
                          }
                        >
                          <img
                            src={left[1]?.image}
                            alt={left[1]?.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <div className="ms-5">
                        <div
                          className="border rounded-pill ms-5 overflow-hidden"
                          style={{
                            width: "70px",
                            height: "70px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleAvatarClick(slideIndex, left[2], "left", 2)
                          }
                        >
                          <img
                            src={left[2]?.image}
                            alt={left[2]?.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Center - Active Review */}
                    <div className="col-12 col-md-6 d-flex justify-content-center py-3">
                      <div className="col-12 col-lg-10 d-flex flex-column align-items-center text-center px-0 px-lg-4">
                        <div className="position-relative mb-4">
                          <div
                            className="border rounded-pill overflow-hidden"
                            style={{
                              width: "80px",
                              height: "80px",
                            }}
                          >
                            <img
                              src={active?.image}
                              alt={active?.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div
                            className="position-absolute d-flex align-items-center justify-content-center bg-dark rounded-pill overflow-hidden"
                            style={{
                              top: "0px",
                              left: "-4px",
                              width: "30px",
                              height: "30px",
                            }}
                          >
                            <img width={10} src={reviewDoubleQuote} alt="double-quote" />
                          </div>
                        </div>
                        <h6 className="fw-semibold">Excellent Work!</h6>
                        <p>{active?.description}</p>
                        <p
                          className="small mb-0"
                          style={{ color: "#2b2b81", fontWeight: 600 }}
                        >
                          {active?.name}
                        </p>
                        <p className="small mb-4" style={{ color: "#2b2b81" }}>
                          {active?.field}
                        </p>
                      </div>
                    </div>

                    {/* Right avatars */}
                    <div className="col-12 col-md-3 d-none d-md-flex flex-column align-items-center justify-content-between">
                      <div className="ms-5">
                        <div
                          className="border rounded-pill ms-2 overflow-hidden"
                          style={{
                            width: "70px",
                            height: "70px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleAvatarClick(slideIndex, right[0], "right", 0)
                          }
                        >
                          <img
                            src={right[0]?.image}
                            alt={right[0]?.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <div className="me-5">
                        <div
                          className="border rounded-pill me-4 overflow-hidden"
                          style={{
                            width: "55px",
                            height: "55px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleAvatarClick(slideIndex, right[1], "right", 1)
                          }
                        >
                          <img
                            src={right[1]?.image}
                            alt={right[1]?.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <div className="ms-5">
                        <div
                          className="border rounded-pill ms-5 overflow-hidden"
                          style={{
                            width: "70px",
                            height: "70px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleAvatarClick(slideIndex, right[2], "right", 2)
                          }
                        >
                          <img
                            src={right[2]?.image}
                            alt={right[2]?.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Pagination dots */}
          <div className="custom-swiper-pagination mt-2" style={{ position: "relative", zIndex: 3 }}/>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;