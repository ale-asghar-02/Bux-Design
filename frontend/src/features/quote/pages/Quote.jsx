import React, { useState, useContext } from "react";
import { useHeadingAnimation } from "../../../hooks/useTextAnimation";
import useQuote from "../hooks/useQuote";
import Navbar from "../../../components/Navbar";
import "../quote.scss";

import quoteImage from "../../../assets/images/quote-img.svg";

const Quote = () => {
  const { headingAnimate, words } = useHeadingAnimation("Let's Talk!", 80);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Redesign my app or website");
  const [budget, setBudget] = useState("less 1k");
  const [projectDescription, setProjectDescription] = useState("");

  const { loading, handleCreateQuote } = useQuote();

  const budgetOptions = [
    { label: "$>1k", value: "less 1k" },
    { label: "$2k-5k", value: "2k-5k" },
    { label: "$5-10k", value: "5k-10k" },
    { label: "Can’t Say", value: "cannot say" },
  ];

  const handleSubmit = async () => {
    const success = await handleCreateQuote({
      username,
      email,
      service,
      budget,
      projectDescription,
    });

    if (success) {
      setUsername("");
      setEmail("");
      setService("Redesign my app or website");
      setBudget("less 1k");
      setProjectDescription("");
    }
  };
  
  return (
    <div className="position-relative">
      <Navbar />

      <div className="container py-4">
        <div className="quote-content-section py-lg-4 mb-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-md-6 col-lg-5 text-center text-md-start mb-3">
                <h2 className="quote-heading">Ready to collaborate?</h2>
                <h1
                  className="sub-heading d-flex flex-wrap"
                  style={{ fontSize: "calc(1.5rem + 1.5vw)", gap: "0.3em" }}
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

              <div className="col-12 col-md-6 col-lg-7">
                <img
                  className="w-100"
                  src={quoteImage}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ----- Quote Form Section ----- */}

        <div className="quote-form-section py-lg-5">
          <div className="container mb-3">
            <form className="row justify-content-between mb-2 mb-lg-3">
              <div className="col-12 col-md-6 col-lg-5 mb-3">
                <div className="mb-3">
                  <label htmlFor="Username" className="form-label">
                    What’s Your Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Username"
                    placeholder="Type Your Full Name..."
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-5 mb-3">
                <div className="mb-3">
                  <label htmlFor="services" className="form-label">
                    What’s Your Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="services"
                    placeholder="Type Your Email..."
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-5 mb-3">
                <div className="mb-3">
                  <label htmlFor="serviceType" className="form-label">
                    What’s Services you are looking for?
                  </label>
                  <select
                    className="form-select"
                    id="serviceType"
                    aria-label="Floating label select example"
                    value={service}
                    onChange={(e) => {
                      setService(e.target.value);
                    }}
                  >
                    <option value="Redesign my app or website">
                      Redesign my app or website
                    </option>
                    <option value="Hiring a dedicated UX/UI Designer">
                      Hiring a dedicated UX/UI Designer
                    </option>
                    <option value="Clickable Design Prototype">
                      Clickable Design Prototype
                    </option>
                    <option value="Other">Other</option>
                    <option value="Design A complete Product from scratch">
                      Design a complete Product from scratch
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-5 mb-3">
                <div className="mb-3">
                  <label htmlFor="budget" className="form-label">
                    What’s Your Budget For the project?
                  </label>
                  <div className="col-12">
                    <div className="money gap-1">
                      {budgetOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`cash ${budget === option.value ? "active" : ""}`}
                          onClick={() => setBudget(option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Tell Us About Your Project
                  </label>
                  <textarea
                    style={{ height: "25vh", paddingBlock: "12px" }}
                    className="form-control bg-white"
                    id="description"
                    placeholder="Type your detailed description..."
                    value={projectDescription}
                    onChange={(e) => {
                      setProjectDescription(e.target.value);
                    }}
                  ></textarea>
                </div>
              </div>
            </form>

            <button
              type="button"
              className="submit fw-light mb-5"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;