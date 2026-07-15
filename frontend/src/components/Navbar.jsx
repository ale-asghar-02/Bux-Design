import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../features/auth/AuthContext";
import { getPublicProfile } from "../features/dashboard/services/dashboardAPI";

import logo from "../assets/images/logo.svg";
import defaultUserImage from "../assets/images/default.jpg";
import emailIcon from "../assets/icons/email-icon.svg";
import linkedInIcon from "../assets/icons/linkedIn-icon.svg";
import dribbleIcon from "../assets/icons/dribble-icon.svg";
import behanceIcon from "../assets/icons/behance-icon.svg";
import pinterestIcon from "../assets/icons/pinterest-icon.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [showContact, setShowContact] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [profile, setProfile] = useState(null);

  const openLink = (url) => { if (url) window.open(url, "_blank", "noreferrer") };

  const openContact = async () => {
    setShowContact(true);
    setTimeout(() => setAnimate(true), 10);
    window.addEventListener("scroll", closeContact, { once: true });

    const data = await getPublicProfile();
    setProfile(data);
  };

  const closeContact = () => {
    setAnimate(false);
    setTimeout(() => setShowContact(false), 300);
    window.removeEventListener("scroll", closeContact);
  };

  return (
    <>
      <nav className="container navbar flex-wrap navbar-expand-lg py-1 py-lg-3">
        <div className="container-fluid">
          <Link to={"/"} className="navbar-brand">
            <img
              style={{ width: "calc(4rem + 2.4vw)" }}
              src={logo}
              alt="Logo"
              height="50"
            />
          </Link>

          <div className="nav-buttons d-flex gap-3 align-items-center">
            {user ? (
              <div
                onClick={() => navigate("/user/dashboard")}
                className="d-flex align-items-center gap-2"
                style={{ cursor: "pointer" }}
              >
                <div
                  className="bg-dark border rounded-pill overflow-hidden"
                  style={{ width: "36px", height: "36px" }}
                >
                  <img
                    src={
                      user.userImage || defaultUserImage
                    }
                    alt="user-image"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <span className="fw-semibold">{user.username}</span>
              </div>
            ) : (
              <>
                <button className="nav-btn" onClick={() => navigate("/quote")}>Get Quote</button>
                <button className="nav-btn" onClick={openContact}>Contact</button>
              </>
            )}
          </div>
        </div>

        <div className="nav-line"></div>
      </nav>

      {showContact && (
        <div className="contact-model col-12 h-100 position-fixed top-0"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: animate ? 1 : 0,
            transition: "opacity 0.3s ease",
            zIndex: "15",
          }}
          onClick={closeContact} >

          <div className="container d-flex align-items-center justify-content-end py-5">
            <div className="col-12 col-md-7 col-lg-6 col-xl-4 mt-md-1 mt-lg-3"
              style={{
                transform: animate ? "translateY(0)" : "translateY(-30px)",
                opacity: animate ? 1 : 0,
                transition: "transform 0.3s ease, opacity 0.3s ease",
              }}
              onClick={(e) => e.stopPropagation()} >
              <div className="text-white bg-black rounded-3 p-3 p-lg-4">
                <div className="col-12 d-flex align-items-center justify-content-between mb-3">
                  <h4>Contact</h4>
                  <i className="ti ti-x p-1 rounded-1"
                    style={{ backgroundColor: "#4d4d4d", cursor: "pointer" }}
                    onClick={closeContact}
                  ></i>
                </div>

                {profile?.email && (
                  <div
                    className="col-12 nav-contact-icon mb-1"
                    onClick={() => {
                      window.open(
                        `https://mail.google.com/mail/?view=cm&to=${profile.email}`,
                        "_blank",
                        "noreferrer",
                      );
                    }}
                    style={{ cursor: "pointer", backgroundColor: "#353535a6" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div className="contact-icon">
                        <img
                          width={20}
                          src={emailIcon}
                          alt="email-icon"
                        />
                      </div>
                      <p
                        className="fw-medium mb-0"
                        style={{ fontSize: "17px" }}
                      >
                        Email
                      </p>
                    </div>
                    <i className="ti ti-arrow-right fs-5"></i>
                  </div>
                )}

                {profile?.linkedIn && (
                  <div
                    className="col-12 nav-contact-icon mb-1"
                    onClick={() => openLink(profile.linkedIn)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div className="contact-icon">
                        <img
                          width={27}
                          src={linkedInIcon}
                          alt="linkedIn-icon"
                        />
                      </div>
                      <p
                        className="fw-medium mb-0"
                        style={{ fontSize: "17px" }}
                      >
                        LinkedIn
                      </p>
                    </div>
                    <i className="ti ti-arrow-right fs-5"></i>
                  </div>
                )}

                {profile?.dribbble && (
                  <div
                    className="col-12 nav-contact-icon mb-1"
                    onClick={() => openLink(profile.dribbble)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div className="contact-icon">
                        <img
                          width={27}
                          src={dribbleIcon}
                          alt="dribble-icon"
                        />
                      </div>
                      <p
                        className="fw-medium mb-0"
                        style={{ fontSize: "17px" }}
                      >
                        Dribbble
                      </p>
                    </div>
                    <i className="ti ti-arrow-right fs-5"></i>
                  </div>
                )}

                {profile?.behance && (
                  <div
                    className="col-12 nav-contact-icon mb-1"
                    onClick={() => openLink(profile.behance)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div className="contact-icon">
                        <img
                          width={26}
                          src={behanceIcon}
                          alt="behance-icon"
                        />
                      </div>
                      <p
                        className="fw-medium mb-0"
                        style={{ fontSize: "17px" }}
                      >
                        Behance
                      </p>
                    </div>
                    <i className="ti ti-arrow-right fs-5"></i>
                  </div>
                )}

                {profile?.pinterest && (
                  <div
                    className="col-12 nav-contact-icon mb-1"
                    onClick={() => openLink(profile.pinterest)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div className="contact-icon">
                        <img
                          width={27}
                          src={pinterestIcon}
                          alt="pinterest-icon"
                        />
                      </div>
                      <p
                        className="fw-medium mb-0"
                        style={{ fontSize: "17px" }}
                      >
                        Pinterest
                      </p>
                    </div>
                    <i className="ti ti-arrow-right fs-5"></i>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;