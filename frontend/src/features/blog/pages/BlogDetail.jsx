import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useBlog from "../hooks/useBlog";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const BlogDetail = () => {
  const navigate = useNavigate();
  const { blogs, handleGetAllBlogs } = useBlog();

  useEffect(() => { handleGetAllBlogs() }, []);

  const relatedBlogs = blogs.filter((blog) =>
    /ui|ux|uiux|design|prototype|wireframe|figma|branding/i.test(
      blog.title || "",
    ),
  );

  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // speed multiplier
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDragging = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  return (
    <div className="position-relative">
      <Navbar />

      <div className="container mt-5">
        <div className="blog-content-section">
          <div className="container">
            <div className="row align-items-end justify-content-between mb-5">
              <div className="col-12 col-md-6 col-lg-5 col-xl-4 p-lg-0">
                <h1 className="sub-heading text-center text-lg-start">
                  UX AND UI - THE
                </h1>
                <h1 className="sub-heading text-center text-lg-end">
                  WAY TO A
                </h1>
                <h1 className="sub-heading text-center text-lg-start">
                  BETTER USER EXPERIENCE
                </h1>
              </div>
              <div className="col-12 col-md-6 col-lg-6 d-flex align-items-end">
                <p
                  className="fw-medium"
                  style={{ fontSize: "calc(0.8rem + 1.1vw)" }}
                >
                  In this article, we will go into more detail about the
                  difference between the two types, and how they work together
                  to create a better user experience.
                </p>
              </div>
            </div>
            <div className="col-12 py-lg-5 content">
              <div className="mb-4 mb-lg-5">
                <h1>What is UX and UI design? </h1>
                <p className="mb-lg-0">
                  Imagine you open an app to order a pizza. You are greeted by a
                  clean and simple user interface, where you can quickly and
                  easily order your favorite pizza. You will then receive an
                  estimated delivery time that you can continuously monitor
                  while you wait. When the hot and hearty pizza is finally
                  delivered, you don't even think about how easy it was - from
                  opening the app to the pizza being delivered.
                </p>
                <p className="mb-lg-0">
                  This is an example of how good design can improve the user
                  experience, using both UX (User Experience) and UI (User
                  Interface) design.
                </p>
                <p className="mb-lg-0">
                  In this article, we will go into more detail about the
                  difference between the two types, and how they work together
                  to create a better user experience.
                </p>
              </div>

              <div className="mb-4 mb-lg-5">
                <h1>What is UX and UI design? </h1>
                <p className="mb-lg-0">
                  UX (User Experience) design refers to the overall experience a
                  user has of a website, app or system. The aim is to create an
                  experience that is simple, intuitive and satisfying for users.
                  This includes optimizing the navigation, ensuring an easy
                  interaction with the product and ensuring that the information
                  is logical and accessible.
                </p>
              </div>

              <div className="mb-4 mb-lg-5">
                <h1>UI design</h1>
                <p className="mb-lg-0">
                  UI design (User Interface) is related to the design of a
                  website, app or system. It's about how a user interacts with
                  the page - everything from buttons and forms, to colors, text,
                  animations and images. The purpose of UI is to create a good
                  user experience using an attractive web design.
                </p>
              </div>

              <div className="mb-4 mb-lg-5">
                <h1>UI vs. UX</h1>
                <p className="mb-lg-0">
                  It is not always easy to understand the difference between UX
                  and UI design, as both are related to user experience. Simply
                  explained, they focus on two different aspects - UI is about
                  how the website looks, while UX is about how the website
                  actually works.
                </p>
                <p className="mb-lg-0">
                  However, both should be integrated on a good website. It does
                  not help that the website looks good if it does not function
                  optimally, and vice versa. They cannot do it alone, and work
                  together to create a better user experience by combining
                  functionality and aesthetics.
                </p>
              </div>

              <h3
                style={{ fontSize: "calc(0.9rem + 0.4vw)" }}
                className="mb-4 mb-lg-5 fw-semibold fst-italic"
              >
                Let's start with Tesla :
              </h3>

              <div className="mb-4 mb-lg-5">
                <h1>UI: What does the car look like?</h1>
                <p className="mb-lg-0">
                  You are looking at a brand new Tesla Model 3 at the
                  dealership. Perhaps the first thing you notice is the cool
                  color of the car, or the stylish design on the front and
                  wheels? You get into the car and move your gaze towards the
                  simple and stylish dashboard. In the middle of the dashboard
                  you will see a large touch screen that easily gives you access
                  to several functions – music, GPS navigation, climate control
                  and more.
                </p>
                <p className="mb-lg-0">
                  It is the design that catches our attention first when we look
                  at a product or a website. We like not to think about the work
                  behind creating a user-friendly experience, i.e. UX design.
                </p>
              </div>

              <div className="mb-4 mb-lg-3">
                <h1>UX: How does the car work?</h1>
                <p className="mb-lg-0">
                  You want to test how the various functions in the car work
                  before you make a purchase decision. For example, is it easy
                  to start the car, adjust the temperature or add GPS
                  navigation? You will find that you can start the car directly
                  from the touch screen, and that it is easy and quick to find
                  and adjust the various functions. Based on the overall
                  experience, you decide to buy a Tesla Model 3.
                </p>
                <p className="mb-lg-0">
                  This example illustrates well how a combination of UI and UX
                  design creates a good user experience. The stylish and modern
                  design, combined with the easy access to the car's functions,
                  creates a good and comfortable driving experience for the
                  driver and passengers.
                </p>
                <p className="mb-lg-0">
                  To summarize, UI design provides an attractive and easy way to
                  interact with the product, while UX design provides a good
                  experience of the product. Both elements are equally important
                  in creating a positive experience for the user, and they work
                  together to provide a complete user experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-card-scrolling" style={{ marginBottom: "calc(100px + 4vw)" }}>
        <div className="container-fluid px-0 scroll-images"
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}>
          <div className="container d-flex gap-2">
            {relatedBlogs.map((blog) => (
              <div className="col-12 col-lg-5" key={blog._id}>
                <div className="card-scroll-image border rounded-2 overflow-hidden mb-2">
                  <img
                    src={ blog.blogImage }
                    alt={blog.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                     draggable="false"
                  />
                </div>
                <div className="col-12">
                  <p className="mb-1" style={{ fontSize: "18px" }}>{blog.title}</p>
                  <p className="text-body-secondary mb-0" style={{ fontSize: "16px" }}>
                    By Bux Design -{" "}
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
                </div>
              </div>
            ))}

            <div className="col-1"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;