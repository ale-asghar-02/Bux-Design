import React, { useContext } from "react";
import { useHeadingAnimation } from '../hooks/useTextAnimation';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import aboutImg from "../assets/images/about-img.svg";

const About = () => {
  const { headingAnimate, words } = useHeadingAnimation("About", 80);
  
  return (
    <div className="position-relative about-section">
      <Navbar />

      <div className="container" style={{ marginBottom : 'calc(50px + 2vw)'}}>
        <div className="text-start mt-5 mb-5">
          <div className="top d-flex justify-content-start">
            <h1
              className="sub-heading d-flex flex-wrap"
              style={{
                fontSize: "calc(1.5rem + 2vw)",
                marginTop: "calc(10px + 2vw)",
                gap: "0.3em",
              }}>
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
          <div className="about-line mb-3"></div>
        </div>

        <div className="about-content mb-4 mb-lg-5">
          <div className="container">
            <div className="d-flex flex-wrap align-items-end">
              <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                <div>
                  <img
                    style={{ width: "calc(14rem + 12.8vw)" }}
                    className="image-fluid ms-3 ms-md-0 ms-lg-5"
                    src={aboutImg}
                    alt="about"
                  />
                </div>
              </div>
              <div className="col-12 col-lg-6 mt-lg-4 px-3">
                <div className="col-12 mb-4">
                  <h1
                    className="sub-heading text-center text-md-start text-lg-start"
                    style={{
                      fontSize: "calc(1rem + 2.3vw)",
                      marginTop: "12px",
                    }}
                  >
                    I’m Bilawal Paracha a Product Designer working remotely from
                    Islamabad Pakistan
                  </h1>
                </div>
                <div className="col-12">
                  <p
                    className="mb-0 text-body-secondary fw-medium"
                    style={{ fontSize: "calc(0.6rem + 0.4vw)" }}
                  >
                    Over the past 4+ Year of dedicated experience in the field
                    of UI/UX design, I have honed my craft through a diverse
                    range of projects and responsibilities have contributed to
                    the Envato marketplace by crafting premium designs for
                    companies to market and sell online, further showcasing my
                    proficiency in delivering market-ready solutions.Alongside
                    my professional endeavors, I have also taken on the role of
                    mentorship, guiding and training over 50 aspiring designers
                    to pursue successful careers in UI/UX design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="info-section py-lg-5 mb-3">
          <div className="container w-100 h-100">
            <div className="content rounded-3">
              <div className="container">
                <div className="row p-2 p-lg-5">
                  <div className="col-12 col-md-6 col-lg-6 p-4">
                    <div>
                      <h1 className="heading">01</h1>
                      <h1 className="heading">Work</h1>
                      <p className="paragraph">
                        I sketch wireframes and make prototypes. Talking through
                        tactile designs existing in the browser is worth its
                        weight. Design tools only carry you so far; the rest
                        should be realized with a link my team can rally around.
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 p-4">
                    <div>
                      <h1 className="heading">02</h1>
                      <h1 className="heading">Collaborate</h1>
                      <p className="paragraph">
                        Good design is not created in a vacuum but rather in a
                        shared space. It must be facilitated and iterated upon
                        as a team. I aim to include stakeholders in my design
                        process and create a collaborative environment that
                        welcomes and encourages feedback.
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 p-4">
                    <div>
                      <h1 className="heading">03</h1>
                      <h1 className="heading">Accessible FTW</h1>
                      <p className="paragraph">
                        I aim to make everything I design accessible to all for
                        one main reason - it's the right thing to do. Accessible
                        products benefit the many, not the few
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 p-4">
                    <div>
                      <h1 className="heading">04</h1>
                      <h1 className="heading">Keep experimenting</h1>
                      <p className="paragraph">
                        Everything I create is subject to change and
                        experimentation. Not everything will work, but it's
                        worth trying - and learning from what doesn't.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 d-flex align-items-center mb-3 mb-lg-0" style={{ minHeight: "50vh" }}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-6">
                <h1
                  className="sub-heading mb-3"
                  style={{ fontSize: "calc(1.4rem + 1.2vw)" }}
                >
                  Let's collaborate if you're committed to sustainability,
                  education, equality, or carbon neutrality.
                </h1>
              </div>
              <div className="col-12 col-md-6 col-lg-6">
                <p
                  style={{ fontSize: "calc(0.8rem + 0.8vw)" }}
                  className="text-body-secondary fw-medium mb-0 fst-italic"
                >
                  I believe we should leave this Earth as good as or better than
                  we found it for future generations; my goal is to contribute
                  to those ideals in whatever way I can. If you feel the same,
                  I'd love to talk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;