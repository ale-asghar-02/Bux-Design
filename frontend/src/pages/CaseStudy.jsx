import React, { useContext } from "react";
import { useHeadingAnimation } from "../hooks/useTextAnimation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import caseStudyImg from "../assets/images/case-study-img.svg";
import emojiImg from "../assets/images/emoji.svg";

const CaseStudy = () => {
  const { headingAnimate, words } = useHeadingAnimation( "Revamping Topgear", 80 );
  
  return (
    <div className="position-relative bg-body-secondary">
      <Navbar />

      <div>
        <div className="study-content">
          <div className="container mb-4 py-3 mb-lg-5">
            <div className="row align-items-center">
              <div className="col-12 col-md-6 col-lg-7 text-center text-md-start text-lg-start mt-3 mb-3">
                <h1
                  className="mb-3 d-flex flex-wrap"
                  style={{
                    fontSize: "calc(30px + 1.6vw)",
                    fontWeight: "900",
                    gap: "0.3em",
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
                <p
                  className="col-12 col-lg-8 tag-paragraph"
                  style={{ fontSize: "calc(15px + 0.32vw)" }}
                >
                  A complete redesign, and thorough analysis of TopGear, Total's
                  internal e-commerse
                </p>
              </div>

              <div className="col-12 col-md-6 col-lg-5">
                <img
                  className="w-100"
                  src={caseStudyImg}
                  alt="case-study-img"
                />
              </div>
            </div>
          </div>

          <div className="bg-white py-lg-5">
            <div className="container py-5">
              <div className="col-12 mb-4 mb-lg-5">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <div className="list1 mb-4">
                      <h5 className="semi-heading">Deliverables</h5>

                      <ul className="px-3">
                        <li>Wireframe</li>
                        <li>High-Fidelity Figma Designs</li>
                        <li>Animation Prototypes</li>
                      </ul>
                    </div>
                    <div className="list2 mb-4">
                      <h5 className="semi-heading">Team</h5>

                      <ul className="px-3">
                        <li>1 Product Designer</li>
                        <li>1 Product Designer</li>
                        <li>4 Developer</li>
                      </ul>
                    </div>
                    <div className="list3 mb-4">
                      <h5 className="semi-heading">My Role</h5>

                      <ul className="px-3">
                        <li>Lead Designer</li>
                        <li>Discovery Research</li>
                        <li>UX/ UI Design</li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-6">
                    <h5 className="semi-heading mb-4">Problem</h5>
                    <div>
                      <p className="tag-paragraph">
                        Lorem ipsum dolor sit amet consectetur. Vitae elit
                        consectetur sodales porttitor volutpat dapibus et enim
                        nullam. Nunc sit morbi scelerisque luctus tellus enim
                        orci.Nec condimentum sit eget magna non tristique orci.
                        Imperdiet mauris vitae at felis risus massa.
                      </p>
                      <p className="tag-paragraph"></p>
                      <p className="tag-paragraph">
                        Lorem ipsum dolor sit amet consectetur. Vitae elit
                        consectetur sodales porttitor volutpat dapibus et enim
                        nullam. Nunc sit morbi scelerisque luctus tellus enim
                        orci.Nec condimentum sit eget magna non tristique orci.
                        Imperdiet mauris vitae at felis risus massa.
                      </p>
                      <p className="tag-paragraph">
                        Lorem ipsum dolor sit amet consectetur. Vitae elit
                        consectetur sodales porttitor volutpat dapibus et enim
                        nullam. Nunc sit morbi scelerisque luctus tellus enim
                        orci.Nec condimentum sit eget magna non tristique orci.
                        Imperdiet mauris vitae at felis risus massa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 mb-5">
                <div className="row justify-content-between">
                  <div className="col-12 col-md-6 col-lg-6 mb-3">
                    <h5 className="semi-heading mb-4">Solution</h5>
                    <div>
                      <p className="tag-paragraph">
                        Lorem ipsum dolor sit amet consectetur. Vitae elit
                        consectetur sodales porttitor volutpat dapibus et enim
                        nullam. Nunc sit morbi scelerisque luctus tellus enim
                        orci.Nec condimentum sit eget magna non tristique orci.
                        Imperdiet mauris vitae at felis risus massa.
                      </p>
                      <p className="tag-paragraph"></p>
                      <p className="tag-paragraph">
                        Lorem ipsum dolor sit amet consectetur. Vitae elit
                        consectetur sodales porttitor volutpat dapibus et enim
                        nullam. Nunc sit morbi scelerisque luctus tellus enim
                        orci.Nec condimentum sit eget magna non tristique orci.
                        Imperdiet mauris vitae at felis risus massa.
                      </p>
                      <p className="tag-paragraph">
                        Lorem ipsum dolor sit amet consectetur. Vitae elit
                        consectetur sodales porttitor volutpat dapibus et enim
                        nullam. Nunc sit morbi scelerisque luctus tellus enim
                        orci.Nec condimentum sit eget magna non tristique orci.
                        Imperdiet mauris vitae at felis risus massa.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-6 col-xl-4">
                    <img
                      className="w-100"
                      src={caseStudyImg}
                      alt="case-study-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="design-section">
          <div className="text py-5 text-center">
            <h1 className="block-heading">Design Process</h1>
          </div>
          <div className="bg-white">
            <div className="container py-lg-5">
              <div className="row d-flex justify-content-center py-5">
                <div className="col-6 col-md-4 col-lg-2 d-flex flex-column align-items-center mb-3 mb-lg-0 me-lg-3 text-center">
                  <div
                    style={{
                      width: "calc(38px + 0.5vw)",
                      height: "calc(38px + 0.5vw)",
                    }}
                    className="icon rounded-2 mb-3 bg-body-secondary d-flex align-items-center justify-content-center"
                  >
                    <i
                      className="ti ti-message-heart"
                      style={{ fontSize: "calc(18px + 0.4vw)" }}
                    ></i>
                  </div>
                  <div>
                    <h3>Empathize</h3>
                    <p className="mb-0 tag-paragraph">User interview</p>
                    <p className="mb-0 tag-paragraph">user Research</p>
                    <p className="mb-0 tag-paragraph">Competitive Analysis</p>
                  </div>
                </div>

                <div className="col-6 col-md-4 col-lg-2 d-flex flex-column align-items-center mb-3 mb-lg-0 mx-lg-3 text-center">
                  <div
                    style={{
                      width: "calc(38px + 0.5vw)",
                      height: "calc(38px + 0.5vw)",
                    }}
                    className="icon rounded-2 mb-3 bg-body-secondary d-flex align-items-center justify-content-center"
                  >
                    <i
                      className="ti ti-target-arrow"
                      style={{ fontSize: "calc(18px + 0.4vw)" }}
                    ></i>
                  </div>
                  <div>
                    <h3>Define</h3>
                    <p className="mb-0 tag-paragraph">Affinity Mapping</p>
                    <p className="mb-0 tag-paragraph">Personas</p>
                    <p className="mb-0 tag-paragraph">Empathy Map</p>
                    <p className="mb-0 tag-paragraph">journey Map </p>
                  </div>
                </div>

                <div className="col-6 col-md-4 col-lg-2 d-flex flex-column align-items-center mb-3 mb-lg-0 mx-lg-3 text-center">
                  <div
                    style={{
                      width: "calc(38px + 0.5vw)",
                      height: "calc(38px + 0.5vw)",
                    }}
                    className="icon rounded-2 mb-3 bg-body-secondary d-flex align-items-center justify-content-center"
                  >
                    <i
                      className="ti ti-bulb"
                      style={{ fontSize: "calc(18px + 0.4vw)" }}
                    ></i>
                  </div>
                  <div>
                    <h3>Ideate</h3>
                    <p className="mb-0 tag-paragraph">User Flow</p>
                    <p className="mb-0 tag-paragraph">Card Sorting</p>
                    <p className="mb-0 tag-paragraph">
                      information Archiecture
                    </p>
                  </div>
                </div>

                <div className="col-6 col-md-4 col-lg-2 d-flex flex-column align-items-center mb-3 mb-lg-0 mx-lg-3 text-center">
                  <div
                    style={{
                      width: "calc(38px + 0.5vw)",
                      height: "calc(38px + 0.5vw)",
                    }}
                    className="icon rounded-2 mb-3 bg-body-secondary d-flex align-items-center justify-content-center"
                  >
                    <i
                      className="ti ti-pencil"
                      style={{ fontSize: "calc(18px + 0.4vw)" }}
                    ></i>
                  </div>
                  <div>
                    <h3>Design</h3>
                    <p className="mb-0 tag-paragraph">Low Fidelity</p>
                    <p className="mb-0 tag-paragraph">high Fidelity</p>
                  </div>
                </div>

                <div className="col-6 col-md-4 col-lg-2 d-flex flex-column align-items-center mb-3 mb-lg-0 ms-lg-3 text-center">
                  <div
                    style={{
                      width: "calc(38px + 0.5vw)",
                      height: "calc(38px + 0.5vw)",
                    }}
                    className="icon rounded-2 mb-3 bg-body-secondary d-flex align-items-center justify-content-center"
                  >
                    <i
                      className="ti ti-clipboard-check"
                      style={{ fontSize: "calc(18px + 0.4vw)" }}
                    ></i>
                  </div>
                  <div>
                    <h3>Test</h3>
                    <p className="mb-0 tag-paragraph">Usability Testing</p>
                    <p className="mb-0 tag-paragraph">Implementing Feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="research-section">
          <div className="text py-5 text-center">
            <h1 className="block-heading">Research Strategy</h1>
          </div>
          <div className="bg-white">
            <div className="container py-lg-5">
              <div className="row d-flex justify-content-between py-5">
                <div className="col-12 col-md-6 col-lg-5 mb-4">
                  <div className="col-12 mb-4 mb-md-5 mb-lg-5">
                    <h5 className="semi-heading mb-3">Interview</h5>
                    <div>
                      <p className="tag-paragraph">
                        During the research phase of my project, I interviewed
                        five people to gain a better understanding of user
                        challenges and motivations.
                      </p>
                    </div>
                  </div>

                  <div className="col-12">
                    <h5 className="small-heading mb-3">Interview Objectives</h5>
                    <div
                      style={{ fontSize: "calc(14px + 0.1vw)" }}
                      className="paragrph"
                    >
                      <ul className="ps-3">
                        <li className="col-lg-10 mb-3">
                          Understanding how users are currently managing their
                          trip bookings
                        </li>
                        <li className="col-lg-10 mb-3">
                          Understanding how users are currently managing their
                          trip
                        </li>
                        <li className="col-lg-10 mb-3">
                          Understanding how users are currently managing their
                          trip bookings
                        </li>
                        <li className="col-lg-10 mb-3">
                          Understanding how users are currently managing their
                          trip bookings
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-12 px-4 col-md-6 col-lg-4 col-xl-3">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <div className="row">
                        <div
                          style={{ position: "relative" }}
                          className="col-1 bg-dargen"
                        >
                          <img
                            style={{
                              position: "absolute",
                              right: "-7px",
                              bottom: 0,
                            }}
                            className="ms-2"
                            src={emojiImg}
                            alt="emoji"
                          />
                        </div>

                        <div className="col-11 p-3 px-lg-4 text-center rounded-3 bg-body-secondary">
                          <p
                            style={{ fontSize: "calc(13px + 0.1vw)" }}
                            className="mb-0 tag-paragraph"
                          >
                            spreadsheets are bit depressing to create a trip
                            literary. it could be more fun.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <div className="row">
                        <div
                          style={{ position: "relative" }}
                          className="col-1 bg-dargen"
                        >
                          <img
                            style={{
                              position: "absolute",
                              right: "-7px",
                              bottom: 0,
                            }}
                            className="ms-2"
                            src={emojiImg}
                            alt="emoji"
                          />
                        </div>

                        <div className="col-11 p-3 px-lg-4 text-center rounded-3 bg-body-secondary">
                          <p
                            style={{ fontSize: "calc(13px + 0.1vw)" }}
                            className="mb-0 tag-paragraph"
                          >
                            spreadsheets are bit depressing to create a trip
                            literary. it could be more fun.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <div className="row">
                        <div
                          style={{ position: "relative" }}
                          className="col-1 bg-dargen"
                        >
                          <img
                            style={{
                              position: "absolute",
                              right: "-7px",
                              bottom: 0,
                            }}
                            className="ms-2"
                            src={emojiImg}
                            alt="emoji"
                          />
                        </div>

                        <div className="col-11 p-3 px-lg-4 text-center rounded-3 bg-body-secondary">
                          <p
                            style={{ fontSize: "calc(13px + 0.1vw)" }}
                            className="mb-0 tag-paragraph"
                          >
                            spreadsheets are bit depressing to create a trip
                            literary. it could be more fun.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <div className="row">
                        <div
                          style={{ position: "relative" }}
                          className="col-1 bg-dargen"
                        >
                          <img
                            style={{
                              position: "absolute",
                              right: "-7px",
                              bottom: 0,
                            }}
                            className="ms-2"
                            src={emojiImg}
                            alt="emoji"
                          />
                        </div>

                        <div className="col-11 p-3 px-lg-4 text-center rounded-3 bg-body-secondary">
                          <p
                            style={{ fontSize: "calc(13px + 0.1vw)" }}
                            className="mb-0 tag-paragraph"
                          >
                            spreadsheets are bit depressing to create a trip
                            literary. it could be more fun.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="design-phase-section">
          <div className="text py-5 text-center">
            <h1 className="block-heading">Design Phase</h1>
          </div>
          <div className="bg-white">
            <div className="container py-lg-5">
              <div className="row d-flex justify-content-between py-5">
                <div className="col-12 col-md-6 col-lg-5 mb-5">
                  <div className="col-12 mb-4 mb-md-5 mb-lg-5">
                    <h5 className="semi-heading mb-3">
                      Low fidelity wireframes
                    </h5>
                    <div>
                      <p className="tag-paragraph">
                        I usually start the design process with low fidelity
                        wireframes. This is the way I iterate through many
                        design options quickly. What my wireframes I was able to
                        clearly define the basic feature and man user journey of
                        the app or website
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-lg-10 ms-2">
                    <h5 className="small-heading fst-italic mb-3">
                      What can users do in the app or web?
                    </h5>
                    <div className="paragrph">
                      <ul className="ps-3">
                        <li className="mb-2">
                          Understanding how users are currently managing their
                          trip bookings
                        </li>
                        <li className="mb-2">
                          Understanding how users are currently managing their
                          trip
                        </li>
                        <li className="mb-2">
                          Understanding how users are currently managing their
                          trip bookings
                        </li>
                        <li className="mb-2">
                          Understanding how users are currently managing their
                          trip bookings
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-6 col-xl-4">
                  <img
                    className="w-100"
                    src={caseStudyImg}
                    alt="case-study-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="research-section">
          <div className="text py-5 text-center">
            <h1 style={{ letterSpacing: "6px" }} className="block-heading">
              What I DID
            </h1>
          </div>
          <div className="bg-white">
            <div className="container py-lg-5">
              <div className="row py-5">
                <div className="col-12 d-flex flex-column align-items-center text-center mb-5">
                  <h1
                    style={{
                      fontSize: "calc(22px + 1.7vw)",
                      fontWeight: "800",
                    }}
                    className="mb-3"
                  >
                    Scope of work and responsibility
                  </h1>
                  <p className="col-12 col-lg-8 col-xl-7 mb-0 tag-paragraph">
                    In the project i dove into the user research, collect data
                    from other mobile application, and did some google search
                    later which was used as basic of establishment of project
                    goals.
                  </p>
                </div>

                <div className="col-12 col-md-6 col-lg-3 d-flex flex-column align-items-center text-center px-3 mb-3 mb-lg-0">
                  <div
                    style={{
                      width: "calc(38px + 0.5vw)",
                      height: "calc(38px + 0.5vw)",
                    }}
                    className="icon rounded-2 mb-3 bg-body-secondary d-flex align-items-center justify-content-center"
                  >
                    <i
                      className="ti ti-search"
                      style={{ fontSize: "calc(18px + 0.4vw)" }}
                    ></i>
                  </div>
                  <div>
                    <h3>Research</h3>
                    <p className="mb-0 tag-paragraph">
                      I did the user research and read articles on TOI and Quora
                      and cover the whole spectrum of perspective necessary to
                      solve user problem
                    </p>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3 d-flex flex-column align-items-center text-center px-3 mb-3 mb-lg-0">
                  <div
                    style={{
                      width: "calc(38px + 0.5vw)",
                      height: "calc(38px + 0.5vw)",
                    }}
                    className="icon rounded-2 mb-3 bg-body-secondary d-flex align-items-center justify-content-center"
                  >
                    <i
                      className="ti ti-route"
                      style={{ fontSize: "calc(18px + 0.4vw)" }}
                    ></i>
                  </div>
                  <div>
                    <h3>UX Design</h3>
                    <p className="mb-0 tag-paragraph">
                      I did the user research and read articles on TOI and Quora
                      and cover the whole spectrum of perspective necessary to
                      solve user problem
                    </p>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3 d-flex flex-column align-items-center text-center px-3 mb-3 mb-lg-0">
                  <div
                    style={{
                      width: "calc(38px + 0.5vw)",
                      height: "calc(38px + 0.5vw)",
                    }}
                    className="icon rounded-2 mb-3 bg-body-secondary d-flex align-items-center justify-content-center"
                  >
                    <i
                      className="ti ti-layout-grid"
                      style={{ fontSize: "calc(18px + 0.4vw)" }}
                    ></i>
                  </div>
                  <div>
                    <h3>UI Design</h3>
                    <p className="mb-0 tag-paragraph">
                      I did the user research and read articles on TOI and Quora
                      and cover the whole spectrum of perspective necessary to
                      solve user problem
                    </p>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3 d-flex flex-column align-items-center text-center px-3 mb-3 mb-lg-0">
                  <div
                    style={{
                      width: "calc(38px + 0.5vw)",
                      height: "calc(38px + 0.5vw)",
                    }}
                    className="icon rounded-2 mb-3 bg-body-secondary d-flex align-items-center justify-content-center"
                  >
                    <i
                      className="ti ti-device-laptop"
                      style={{ fontSize: "calc(18px + 0.4vw)" }}
                    ></i>
                  </div>
                  <div>
                    <h3>Prototype</h3>
                    <p className="mb-0 tag-paragraph">
                      I did the user research and read articles on TOI and Quora
                      and cover the whole spectrum of perspective necessary to
                      solve user problem
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="Wireframing-section">
          <div className="text py-5 text-center">
            <h1 className="block-heading">Wireframing</h1>
          </div>
          <div className="bg-white">
            <div className="container py-lg-5">
              <div className="row py-5">
                <div className="col-12 mb-5">
                  <div className="col-12 mb-4 mb-md-5 mb-lg-5">
                    <h5 className="semi-heading mb-3">Low Fidelity</h5>
                    <div className="col-12 col-lg-10 col-xl-9">
                      <p className="tag-paragraph">
                        In the project i dove into the user research, collect
                        data from other mobile application, and did some google
                        search later which was used as basic of establishment of
                        project goals.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 py-5 d-flex align-items-center justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7 py-lg-5">
                      <img
                        className="col-12 Wireframing-img"
                        src={caseStudyImg}
                        alt="case-study-img"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="m-0" />
          <div className="bg-white">
            <div className="container py-lg-5">
              <div className="row py-5">
                <div className="col-12 mb-5">
                  <div className="col-12 mb-4 mb-md-5 mb-lg-5">
                    <h5 className="semi-heading mb-3">High Fidelity</h5>
                    <div className="col-12 col-lg-10 col-xl-9">
                      <p className="tag-paragraph">
                        In the project i dove into the user research, collect
                        data from other mobile application, and did some google
                        search later which was used as basic of establishment of
                        project goals.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 py-5 d-flex align-items-center justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7 py-lg-5">
                      <img
                        className="col-12 Wireframing-img"
                        src={caseStudyImg}
                        alt="case-study-img"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="Test-phase-section">
          <div className="text py-5 text-center">
            <h1 className="block-heading">Test Phase</h1>
          </div>

          <div className="bg-white">
            <div className="container py-lg-5">
              <div className="row py-5">
                <div className="col-12 mb-5">
                  <div className="col-12 mb-4 mb-md-5 mb-lg-5">
                    <h5 className="semi-heading">Usability</h5>
                    <div>
                      <p className="col-12 tag-paragraph">
                        we tested our prototype with 5 users and it was done
                        individually and remotely to find and know their true
                        reaction whether our products meets user expectations.
                        Usability testing's helps us get better on it
                      </p>
                    </div>
                  </div>

                  <div className="col-12 mb-4 mb-lg-5">
                    <div className="row">
                      <div className="col-12 col-md-6 col-lg-6 mb-3">
                        <div className="list1 mb-3">
                          <h5 className="small-heading mb-3">Pain Points</h5>

                          <div style={{ fontSize: "calc(14px + 0.2vw)" }}>
                            <p className="mb-2 tag-paragraph">
                              1. Login can be made as OTP based login.
                            </p>
                            <p className="mb-2 tag-paragraph">
                              2. Accessing the trainer profile was little
                              difficult.
                            </p>
                            <p className="mb-2 tag-paragraph">
                              3. Filter should be created on the shop page.
                            </p>
                            <p className="mb-2 tag-paragraph">
                              4. Adding picture was difficult.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-lg-6">
                        <h5 className="small-heading">Positive Feedback</h5>
                        <div>
                          <p className="mb-2 tag-paragraph">
                            1. Users were happy with the navigation.
                          </p>
                          <p className="mb-2 tag-paragraph">
                            2. Some user liked the use of clean and aesthetic
                            design.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CaseStudy;