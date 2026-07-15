import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPublicProfile } from "../features/dashboard/services/dashboardAPI";
import { IconArrowRightBar, IconMailOpened, IconBrandLinkedin, IconBrandBehance, IconBrandDribbble, IconBrandPinterest } from "@tabler/icons-react";

import footerBg1 from "../assets/images/footer-bg-1.svg";
import footerBg2 from "../assets/images/footer-bg-2.svg";
import footerArrow from "../assets/images/footer-arrow.png";
import starIcon from "../assets/icons/star.png";
import arrowRightIcon from "../assets/icons/arrow-right.svg";
import bottomToUpIcon from "../assets/icons/bottom-to-up.svg";

const Footer = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

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
    <div className="footer pt-5">
      <div className="bg-image">
        <img className="footer-img-1" src={footerBg1} />
        <img className="footer-img-2" src={footerBg2} />
      </div>

      <div className="container-lg mt-3">
        <div className="footer-top ps-lg-5">
          <div className="row d-flex flex-wrap align-items-center">
            <div className="col-12 col-md-7 col-lg-9 col-xl-8 position-relative text-center text-md-start mb-0 mb-md-5">
              <p>
                Have an idea <br />
                <p className="ms-lg-5 ps-lg-5"> Let’s Bring it to life </p>
              </p>
              <div>
                <img
                  style={{ width: "calc(10px + 12vw)", height: "fit-content" }}
                  className="footer-arrow-image"
                  src={footerArrow}
                />
              </div>
            </div>

            <div className="col-12 col-md-5 col-lg-3 col-xl-4 d-flex justify-content-center">
              <div className="footer-circle" onClick={()=> { navigate('/quote') }}>
                <p
                  className="text-decoration-none d-flex align-items-center mb-0">
                  <span>Get Started</span>
                  <IconArrowRightBar stroke={1.5} size={30} />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-middle mt-2 px-2">
          <div className="col-12 col-md-3 col-lg-4 col-xl-3 mb-4 mb-md-0">
            <div className="footer-text-circle rounded-pill position-relative">
              <svg
                className="rotate-circle-text"
                width="150"
                height="150"
                viewBox="0 0 150 150">
                <path
                  id="circlePath"
                  d="M 75,75 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                  fill="none"/>

                <text>
                  <textPath
                    href="#circlePath"
                    className="text-uppercase fw-medium"
                    style={{ fontSize: "13px", letterSpacing: -0.5 }}>
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
          <div className="col-12 col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
            <div className="col-12 nav-items mb-lg-4 mb-3 p-0">
              <Link
                to="/"
                style={{ textDecoration: "none" }}
                className="left-item p-0 d-flex align-items-center justify-content-between">
                <h2 className="fw-medium">Home</h2>
                <div className="image-4 mx-1">
                  <img
                    style={{ width: "calc(18px + 0.2vw)" }}
                    src={arrowRightIcon}
                  />
                </div>
              </Link>
            </div>
            <div className="col-12 nav-items mb-lg-4 mb-3 p-0">
              <Link
                to="/about"
                style={{ textDecoration: "none" }}
                className="left-item p-0 d-flex align-items-center justify-content-between">
                <h2 className="fw-medium">About</h2>
                <div className="image-4 mx-1">
                  <img
                    style={{ width: "calc(18px + 0.2vw)" }}
                    src={arrowRightIcon}
                  />
                </div>
              </Link>
            </div>
            <div className="col-12 nav-items mb-lg-4 mb-3 p-0">
              <Link
                to="/portfolio"
                style={{ textDecoration: "none" }}
                className="left-item p-0 d-flex align-items-center justify-content-between">
                <h2 className="fw-medium">Work</h2>
                <div className="image-4 mx-1">
                  <img
                    style={{ width: "calc(18px + 0.2vw)" }}
                    src={arrowRightIcon}
                  />
                </div>
              </Link>
            </div>
            <div className="col-12 nav-items mb-lg-4 mb-3 p-0">
              <Link
                to="/services"
                style={{ textDecoration: "none" }}
                className="left-item p-0 d-flex align-items-center justify-content-between">
                <h2 className="fw-medium">Services</h2>
                <div className="image-4 mx-1">
                  <img
                    style={{ width: "calc(18px + 0.2vw)" }}
                    src={arrowRightIcon}
                  />
                </div>
              </Link>
            </div>
            <div className="col-12 nav-items mb-lg-4 mb-3 p-0">
              <Link
                to="/blogs"
                style={{ textDecoration: "none" }}
                className="left-item p-0 d-flex align-items-center justify-content-between">
                <h2 className="fw-medium">Blogs</h2>
                <div className="image-4 mx-1">
                  <img
                    style={{ width: "calc(18px + 0.2vw)" }}
                    src={arrowRightIcon}
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className="col-12 col-md-2 col-lg-2 d-flex flex-wrap icons">
            <div className="col-6 col-md-12 d-flex align-items-center mb-3 mb-lg-4">
              <div
                className="btn-icon me-3"
                onClick={async () => {
                  const data = await loadProfile();
                  if (data?.email) {
                    window.open(
                      `https://mail.google.com/mail/?view=cm&to=${data.email}`,
                      "_blank",
                      "noreferrer",
                    );
                  }
                }}
              >
                <IconMailOpened stroke={1.5} />
              </div>
              <p className="mb-0 icon-text">Email</p>
            </div>
            <div className="col-6 col-md-12 d-flex align-items-center mb-3 mb-lg-4">
              <div className="btn-icon me-3" onClick={() => handleLink("linkedIn")}>
                <IconBrandLinkedin stroke={1.5} size={25} />
              </div>
              <p className="mb-0 icon-text">LinkedIn</p>
            </div>
            <div className="col-6 col-md-12 d-flex align-items-center mb-3 mb-lg-4">
              <div className="btn-icon me-3" onClick={() => handleLink("behance")}>
                <IconBrandBehance stroke={1.5} />
              </div>
              <p className="mb-0 icon-text">Behance</p>
            </div>
            <div className="col-6 col-md-12 d-flex align-items-center mb-3 mb-lg-4">
              <div className="btn-icon me-3" onClick={() => handleLink("dribbble")}>
                <IconBrandDribbble stroke={1.5} />
              </div>
              <p className="mb-0 icon-text">Dribble</p>
            </div>
            <div className="col-6 col-md-12 d-flex align-items-center mb-3 mb-lg-4">
              <div className="btn-icon me-3" onClick={() => handleLink("pinterest")}>
                <IconBrandPinterest stroke={1.5} />
              </div>
              <p className="mb-0 icon-text">Pinterest</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center" style={{ borderTop: "1px solid #f7f7f71f" }}>
        <p class="fw-light py-4 mb-0" style={{ color: "#f7f7f794" }}>
          Copyright © 2022 Bux Designs, All rights reserved.
        </p>
      </div>

      <div>
        <a href="#" className="bottom-to-top">
          <img
            style={{ width: "calc(20px + 0.3vw)" }}
            src={bottomToUpIcon}
          />
        </a>
      </div>
    </div>
  );
};

export default Footer;