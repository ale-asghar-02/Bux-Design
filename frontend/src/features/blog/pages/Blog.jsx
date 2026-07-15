import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useHeadingAnimation } from "../../../hooks/useTextAnimation";
import useBlog from "../hooks/useBlog";
import '../blog.scss';

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const Blog = () => {
  const navigate = useNavigate();
  const { headingAnimate, words } = useHeadingAnimation( "Our Propaganda Thoughts", 80 );
  const { blogs, loading, handleGetAllBlogs } = useBlog();

  useEffect(() => { handleGetAllBlogs() }, []);

  return (
    <div className="position-relative">
      <Navbar />

      <div className="container thought-section px-lg-5 py-5" style={{ marginBottom: "calc(50px + 2vw)" }}>
        <div className="px-lg-5">
          <div className="text-center mb-lg-5">
            <h1
              className="sub-heading d-flex flex-wrap justify-content-center"
              style={{ fontSize: "calc(30px + 1.5vw)", gap: "0.3em" }}
            >
              {words.map((word, wi) => (
                <span
                  key={wi}
                  className={wi === 1 ? "text-line" : undefined}
                  style={{ display: "inline-flex" }}
                >
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

          {loading ? (
            <div className="text-center py-5">
              <p>Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-5">
              <p>No blogs yet.</p>
            </div>
          ) : (
            <div className="cards">
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                {blogs.map((blog) => (
                  <div className="col-12 mb-lg-1" key={blog._id}>
                    <div className="card border-0 overflow-hidden">
                      <div
                        className="col-12 mb-2"
                        style={{ height: "calc(18vh + 8vw)" }}
                      >
                        <img
                          src={
                            blog.blogImage
                          }
                          className="col-12 h-100 object-fit-cover border rounded-2"
                          alt={blog.title}
                        />
                      </div>
                      <div className="card-body p-0">
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
                          onClick={() => navigate(`/blog-details/${blog._id}`)}
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
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;