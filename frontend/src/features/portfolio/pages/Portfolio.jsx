import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useHeadingAnimation } from "../../../hooks/useTextAnimation";
import usePortfolio from "../hooks/usePortfolio";

import Navbar from "../../../components/Navbar";
import ProjectCard from "../components/ProjectCard";

const Portfolio = () => {
  const { headingAnimate, words } = useHeadingAnimation("Work", 80);

  const [isSort, setIsSort] = useState(false);
  const [selected, setSelected] = useState("all");
  const { portfolios, loading, handleGetAllPortfolios } = usePortfolio();

  useEffect(() => { handleGetAllPortfolios() }, []);

  const filteredPortfolios = portfolios.filter((item) => {
    if (selected === "all") return true;
    return item.field?.toLowerCase() === selected.toLowerCase();
  });

  return (
    <div className="position-relative">
      <Navbar />

      <div className="work-section py-5 mb-5">
        <div className="container">
          <div className="text-center mb-4">
            <h1
              className="sub-heading d-flex justify-content-center"
              style={{ fontSize: "calc(30px + 1.5vw)", gap: "0.3em" }}
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
                    { value: "mobile-app", label: "Mobile-app" },
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

              <small style={{ fontSize: "calc(13px + 0.2vw)" }} className="fw-medium">Info</small>
            </div>
            <Link to={"/portfolio"} className="view-all-btn">View All</Link>
          </div>
        </div>

        {loading ? (
          <div className="container text-center py-5">
            <p>Loading projects...</p>
          </div>
        ) : filteredPortfolios.length === 0 ? (
          <div className="container text-center py-5">
            <p className="text-secondary">No projects found.</p>
          </div>
        ) : (
          <div className="col-12 porfolio-card d-flex flex-column gap-2">
            {filteredPortfolios.map((portfolio) => (
              <ProjectCard key={portfolio._id} portfolio={portfolio} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;