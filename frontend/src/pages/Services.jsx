import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHeadingAnimation } from "../hooks/useTextAnimation";
import useReview from "../features/review/hooks/useReview";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"
import { IconStarFilled, IconStarHalfFilled } from "@tabler/icons-react";

import servicesImg1 from "../assets/images/service-img-1.avif";
import servicesImg2 from "../assets/images/service-img-2.avif";
import defaultUserImage from "../assets/images/default.jpg";

const services = [
  {
    icon: "ti-palette",
    title: "UI/UX Design",
    description:
      "Wireframes, user flows, and high-fidelity interfaces that make a product feel obvious to use.",
  },
  {
    icon: "ti-device-laptop",
    title: "Web App Design",
    description:
      "End-to-end design for web platforms, from onboarding screens to dense day-to-day dashboards.",
  },
  {
    icon: "ti-bulb",
    title: "Product Design",
    description:
      "Taking a rough idea and shaping it into a validated, usable digital product.",
  },
  {
    icon: "ti-device-mobile",
    title: "Mobile App Design",
    description:
      "Native-feeling experiences for iOS and Android, built around how people actually hold their phones.",
  },
  {
    icon: "ti-typography",
    title: "Brand Identity",
    description:
      "Visual identities and design language that give a product a recognizable, consistent voice.",
  },
  {
    icon: "ti-layout-grid",
    title: "Design Systems",
    description:
      "Component libraries and documentation that keep teams shipping consistent UI at speed.",
  },
];

// Formats a number like 1000 -> "1K", 1500 -> "1.5K", 1000000 -> "1M"
const formatCount = (num) => {
  if (!num || num < 0) return "0";

  if (num >= 1000000) {
    const val = num / 1000000;
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + "M";
  }

  if (num >= 1000) {
    const val = num / 1000;
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + "K";
  }

  return num.toString();
};

const Services = () => {
  const navigate = useNavigate();
  const { reviews, handleGetAllReviews } = useReview();
  const { headingAnimate, words } = useHeadingAnimation( "Designing Products People Actually Want to Use", 80 );

  useEffect(() => { handleGetAllReviews() }, []);

  const approvedReviews = reviews.filter((r) => r.status === "approved");

  const topReviews = [...approvedReviews]
    .filter((r) => r.rating >= 4.5)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Oldest (starting) reviews — not the latest ones
  const startingReviews = [...approvedReviews]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(0, 3);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IconStarFilled key={`full-${i}`} size={"1rem"} color="orange" />);
    }
    if (hasHalf) {
      stars.push(<IconStarHalfFilled key="half" size={"1rem"} color="orange" />);
    }
    return stars;
  };

  return (
    <div className="position-relative">
      <Navbar />

      <div className="container">
        <div className="mt-5 mb-5">
          <div className="row align-items-end justify-content-between">
            <div className="col-12 col-lg-6">
              <h1
                className="sub-heading mb-0 d-flex flex-wrap"
                style={{ fontSize: "calc(1.6rem + 2.2vw)", gap: "0.3em", lineHeight : 1 }}
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
            <div className="col-12 col-lg-5 mt-3 mt-lg-0">
              <p
                className="text-body-secondary fw-medium mb-3"
                style={{ fontSize: "calc(0.7rem + 0.5vw)" }}
              >
                I provide thoughtful, practical design services that solve real
                product problems and ship without drama.
              </p>
              <button
                type="button"
                onClick={() => { navigate("/quote") }}
                className="btn btn-dark py-2 px-3 rounded-pill"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-5">
          <div className="col-12 col-lg-4 col-xl-5" style={{ height: "42vh" }}>
            <img
              src={servicesImg1}
              alt="design work"
              className="w-100 h-100 object-fit-cover border rounded-4"
            />
          </div>
          <div className="col-12 col-lg-4 col-xl-3">
            <div className="svc-stat-card h-100 d-flex flex-column justify-content-between rounded-4 p-3 p-lg-4">
              <h1 className="mb-0 fw-semibold">Designers Mentored</h1>
              <h1 className="fw-medium mb-0">{formatCount(approvedReviews.length)}+</h1>
              <div className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                {Array.from({ length: 3 }).map((_, i) => {
                    const r = startingReviews[i];
                  return (
                      <span className="svc-avatar" key={r?._id || i}>
                      <img
                        className="w-100 h-100 object-fit-cover"
                        src={r?.image || defaultUserImage}
                        alt="user-review"
                      />
                    </span>
                  );
                })}
              </div>
                <span className="svc-avatar">+</span>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4 col-xl-4" style={{ height: "33vh" }}>
            <img
              src={servicesImg2}
              alt="design work"
              className="w-100 h-100 object-fit-cover border rounded-4"
            />
          </div>
        </div>

        <div className="row mb-4 py-lg-5">
          <div className="col-12 col-lg-6">
            <h2
              className="fw-semibold mb-0"
              style={{ fontSize: "calc(1.3rem + 1.3vw)" }}
            >
              <span className="svc-title fs-5 fw-semibold me-2">
                Our Service
              </span>
              Design Solutions for Every Stage of the Product
            </h2>
          </div>
          <div className="col-12 col-lg-6 d-flex align-items-end">
            <p
              className="text-body-secondary fw-medium mb-1"
              style={{ fontSize: "calc(0.7rem + 0.5vw)" }}
            >
              From the first wireframe to the final handoff, here's where I can
              help your product move forward.
            </p>
          </div>
        </div>

        <div className="row g-3 mb-5">
          {services.map((service) => (
            <div className="col-12 col-md-6 col-lg-4" key={service.title}>
              <div className="svc-card rounded-4 p-3 h-100">
                <span className="svc-card-icon">
                  <i className={`ti ${service.icon}`}></i>
                </span>
                <h3 className="fw-semibold mb-2" style={{ fontSize: "1.1rem" }}>
                  {service.title}
                </h3>
                <p className="small text-body-secondary fw-medium">
                  {service.description}
                </p>
                <div className="d-flex align-items-center gap-2 text-decoration-none">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-pill text-white bg-dark"
                    style={{ width: "25px", height: "25px" }}
                  >
                    <i className="ti ti-plus small"></i>
                  </div>
                  <span className="text-dark fw-medium">Read More</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mb-4 py-lg-5">
          <div className="col-12 col-lg-6">
            <h2
              className="fw-semibold mb-0"
              style={{ fontSize: "calc(1.3rem + 1.3vw)" }}
            >
              <span className="svc-title fs-5 fw-medium me-2">
                Testimonials
              </span>
              What Clients Say About Working Together
            </h2>
          </div>
          <div className="col-12 col-lg-6 d-flex align-items-end justify-content-end">
            <p
              className="text-body-secondary fw-medium mb-0"
              style={{ fontSize: "calc(0.7rem + 0.5vw)" }}
            >
              A few honest words from people I've shipped products with.
            </p>
          </div>
        </div>

        <div className="row g-3 mb-5">
          {topReviews.map((t) => (
            <div className="col-12 col-md-6 col-lg-4" key={t._id}>
              <div className="svc-testimonial h-100 rounded-4 p-3 p-lg-4">
                <div className="d-flex align-items-center gap-1 py-2 mb-2">
                  {renderStars(t.rating)}
                </div>
                <p className="small mb-2">{t.description}</p>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="svc-avatar">
                    <img
                      className="w-100 h-100 object-fit-cover"
                      src={t.image || defaultUserImage}
                      alt="testimonial"
                    />
                  </span>
                  <div>
                    <p className="mb-0 fw-semibold lh-2">{t.name}</p>
                    <p className="mb-0 small text-body-secondary">{t.field}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="svc-cta py-4 py-lg-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-7">
              <p className="mb-1 fw-medium">Let's Build</p>
              <h2
                className="fw-semibold mb-3"
                style={{ fontSize: "calc(1.4rem + 1.4vw)" }}
              >
                Ready to Turn Your Idea Into Something People Love?
              </h2>
              <p className="col-12 col-lg-10 mb-4">
                With years of hands-on experience across web and product design,
                I help teams turn rough ideas into interfaces people enjoy
                using.
              </p>
              <button
                type="button"
                onClick={() => { navigate("/quote") }}
                className="btn btn-light small fw-medium rounded-pill px-4 py-2"
              >
                Start a Project
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;