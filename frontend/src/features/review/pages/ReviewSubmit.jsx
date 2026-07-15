import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useReview from "../hooks/useReview";
import { IconStar, IconStarFilled, IconStarHalfFilled, IconCheck, IconMessage2, IconUser } from "@tabler/icons-react";

const StarRating = ({
  rating,
  setRating,
  allowHalf = true,
  size = 28,
  color = "#f5a623",
  emptyColor = "#d9d9d9",
}) => {
  const [hovered, setHovered] = useState(0);
  const value = hovered || rating;

  const handleSelect = (star, half) => setRating(half ? star - 0.5 : star);
  const handleHover = (star, half) => setHovered(half ? star - 0.5 : star);

  const renderIcon = (star) => {
    const diff = value - star;
    if (diff >= 0) return <IconStarFilled size={size} color={color} />;
    if (allowHalf && diff >= -0.5)
      return <IconStarHalfFilled size={size} color={color} />;
    return <IconStar size={size} color={emptyColor} />;
  };

  return (
    <div className="d-flex gap-2" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          style={{
            position: "relative",
            width: size,
            height: size,
            cursor: "pointer",
          }}
        >
          <div style={{ pointerEvents: "none" }}>{renderIcon(star)}</div>

          {allowHalf ? (
            <>
              <div
                onMouseEnter={() => handleHover(star, true)}
                onClick={() => handleSelect(star, true)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                }}
              />
              <div
                onMouseEnter={() => handleHover(star, false)}
                onClick={() => handleSelect(star, false)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "50%",
                  height: "100%",
                }}
              />
            </>
          ) : (
            <div
              onMouseEnter={() => handleHover(star, false)}
              onClick={() => handleSelect(star, false)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const ReviewSubmit = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { loading, handleSubmitReview } = useReview();

  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("field", field);
    formData.append("description", description);
    formData.append("rating", rating);
    if (image) formData.append("image", image);

    const success = await handleSubmitReview(token, formData);
    if (success) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: "#f9f9f9" }}
      >
        <div className="text-center px-4" style={{ maxWidth: "480px" }}>
          <div
            className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4"
            style={{ width: "72px", height: "72px", background: "#000" }}
          >
            <IconCheck size={32} color="#fff" />
          </div>
          <h3 className="fw-semibold mb-2">Thank you!</h3>
          <p className="text-secondary" style={{ fontSize: "15px" }}>
            Your review has been submitted and is pending approval. We
            appreciate your feedback.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ background: "#f9f9f9" }}
    >
      <div className="w-100 px-3" style={{ maxWidth: "520px" }}>
        {/* Header */}
        <div className="text-center mb-5">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
            style={{ width: "56px", height: "56px", background: "#000" }}
          >
           <IconMessage2 size={26} color="#fff" />
          </div>
          <h2
            className="fw-semibold mb-1"
            style={{ fontSize: "calc(20px + 0.6vw)" }}
          >
            Share Your Experience
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: "14px" }}>
            Your feedback means a lot. It only takes a minute.
          </p>
        </div>

        <div
          className="bg-white rounded-4 p-4 p-md-5"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
        >
          <form onSubmit={handleSubmit}>
            {/* Profile Image */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="rounded-circle overflow-hidden flex-shrink-0"
                style={{
                  width: "64px",
                  height: "64px",
                  background: "#f0f0f0",
                  border: "2px dashed #ccc",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("reviewImage").click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-100 h-100 object-fit-cover"
                  />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <IconUser size={24} color="#aaa" />
                  </div>
                )}
              </div>
              <div>
                <p className="mb-0 fw-medium" style={{ fontSize: "14px" }}>
                  Profile Photo
                </p>
                <p
                  className="mb-0 text-secondary"
                  style={{
                    fontSize: "12px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => document.getElementById("reviewImage").click()}
                >
                  {imagePreview ? "Change photo" : "Upload photo (optional)"}
                </p>
                <input
                  type="file"
                  id="reviewImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Name */}
            <div className="mb-3">
              <label
                className="form-label fw-medium mb-1"
                style={{ fontSize: "14px" }}
              >
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Field */}
            <div className="mb-3">
              <label
                className="form-label fw-medium mb-1"
                style={{ fontSize: "14px" }}
              >
                Your Role / Company
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. CEO at TechCorp"
                value={field}
                onChange={(e) => setField(e.target.value)}
                required
              />
            </div>

            {/* Rating */}
            <div className="mb-3">
              <label
                className="form-label fw-medium mb-2"
                style={{ fontSize: "14px" }}
              >
                Rating
              </label>
              <StarRating rating={rating} setRating={setRating} />
              {!rating && (
                <p
                  className="text-danger mt-1 mb-0"
                  style={{ fontSize: "12px" }}
                >
                  Please select a rating
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label
                  className="form-label fw-medium mb-0"
                  style={{ fontSize: "14px" }}
                >
                  Your Review
                </label>
                <span
                  className={`${description.length >= 480 ? "text-danger" : "text-secondary"}`}
                  style={{ fontSize: "12px" }}
                >
                  {description.length}/500
                </span>
              </div>
              <textarea
                className="form-control"
                placeholder="Tell us about your experience working with Bilawal..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 fw-medium"
              disabled={loading || !rating}
              style={{ borderRadius: "10px", fontSize: "15px" }}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        <p
          className="text-center text-secondary mt-4 mb-0"
          style={{ fontSize: "12px" }}
        >
          Your review will be visible after approval.
        </p>
      </div>
    </div>
  );
};

export default ReviewSubmit;