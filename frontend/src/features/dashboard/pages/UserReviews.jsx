import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import useReview from "../../../features/review/hooks/useReview";
import { IconStar, IconStarFilled, IconStarHalfFilled } from "@tabler/icons-react";

const StarRating = ({
  rating = 0,
  size = 18,
  color = "#f5a623",
  emptyColor = "#d9d9d9",
}) => (
  <div className="star-rating d-flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => {
      const diff = rating - star;
      if (diff >= 0) {
        return <IconStarFilled key={star} size={size} color={color} />;
      }
      if (diff >= -0.5) {
        return <IconStarHalfFilled key={star} size={size} color={color} />;
      }
      return <IconStar key={star} size={size} color={emptyColor} />;
    })}
  </div>
);

const UserReviews = () => {
  const { user } = useContext(AuthContext);
  const { loading, reviews, handleGenerateReviewLink, handleGetAllReviews, handleUpdateReviewStatus, handleDeleteReview } = useReview();

  const [email, setEmail] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const deleteModalCloseRef = React.useRef(null);

  useEffect(() => { handleGetAllReviews() }, []);

  const approvedReviews = reviews.filter((r) => r.status === "approved");
  const pendingReviews = reviews.filter((r) => r.status === "pending");
  const averageRating = approvedReviews.length
    ? (
        approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
        approvedReviews.length
      ).toFixed(1)
    : "0.0";

  const handleSendLink = async (e) => {
    e.preventDefault();
    const success = await handleGenerateReviewLink(email);
    if (success) setEmail("");
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const success = await handleDeleteReview(deleteTarget._id);
    if (success) {
      deleteModalCloseRef.current?.click();
      setDeleteTarget(null);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      approved: { class: "badge bg-success", label: "Approved" },
      pending: { class: "badge bg-warning text-dark", label: "Pending" },
      rejected: { class: "badge bg-danger", label: "Rejected" },
    };
    return map[status] || map.pending;
  };

  const ReviewCard = ({ review }) => {
    const badge = getStatusBadge(review.status);
    return (
      <div className="review-card">
        <div className="review-card-header">
          <div className="d-flex align-items-center gap-3">
            {review.image ? (
              <img
                src={review.image}
                alt={review.name}
                className="border rounded-circle object-fit-cover flex-shrink-0"
                style={{ width: "40px", height: "40px" }}
              />
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "40px", height: "40px", background: "#f0f0f0" }}
              >
                <i
                  className="ti ti-user"
                  style={{ fontSize: "18px", color: "#aaa" }}
                ></i>
              </div>
            )}
            <div>
              <h6 className="mb-0">{review.name || review.email}</h6>
              <span className="review-meta">
                {review.field && `${review.field} • `}
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className={badge.class} style={{ fontSize: "11px" }}>
              {badge.label}
            </span>
            {review.rating && <StarRating rating={review.rating} />}
          </div>
        </div>

        {review.description && (
          <p className="review-message">{review.description}</p>
        )}

        {user?.role === "admin" && (
          <div className="d-flex align-items-center gap-2 mt-2">
            {review.status === "pending" && (
              <>
                <button
                  className="icon-btn"
                  title="Approve"
                  onClick={() =>
                    handleUpdateReviewStatus(review._id, "approved")
                  }
                  disabled={loading}
                >
                  <i className="ti ti-check" style={{ color: "green" }}></i>
                </button>
                <button
                  className="icon-btn"
                  title="Reject"
                  onClick={() =>
                    handleUpdateReviewStatus(review._id, "rejected")
                  }
                  disabled={loading}
                >
                  <i className="ti ti-x" style={{ color: "orange" }}></i>
                </button>
              </>
            )}
            <button
              className="icon-btn icon-btn-danger"
              title="Delete"
              data-bs-toggle="modal"
              data-bs-target="#deleteReviewModal"
              onClick={() => setDeleteTarget(review)}
            >
              <i className="ti ti-trash"></i>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <div>
          <h2>User Reviews</h2>
          <p>Feedback submitted by clients after project completion</p>
        </div>
      </div>

      {/* Send Review Link */}
      {user?.role === "admin" && (
        <div className="mb-4">
          <label className="fw-medium mb-2" style={{ fontSize: "14px" }}>Send Review Invitation</label>
          <form onSubmit={handleSendLink} className="d-flex gap-2">
            <input
              type="email"
              className="form-control"
              placeholder="Enter client email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ maxWidth: "320px" }}
            />
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Link"}
            </button>
          </form>
        </div>
      )}

      {/* Summary */}
      <div className="reviews-summary mb-4">
        <div className="reviews-summary-score">
          <span className="score-number">{averageRating}</span>
          <StarRating rating={parseFloat(averageRating)} />
          <span className="score-count">
            {approvedReviews.length} approved • {reviews.length} total
          </span>
        </div>
      </div>

      {loading && reviews.length === 0 ? (
        <div className="empty-state">
          <p>Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <i className="ti ti-star-off"></i>
          <p>No reviews yet.</p>
        </div>
      ) : (
        <>
          {/* Pending Reviews */}
          {pendingReviews.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-semibold mb-3 d-flex align-items-center gap-2">
                <span className="badge bg-warning text-dark">
                  {pendingReviews.length}
                </span>
                Pending Approval
              </h6>
              <div className="reviews-list">
                {pendingReviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            </div>
          )}

          {/* All Reviews */}
          <div>
            <h6 className="fw-semibold mb-3">All Reviews</h6>
            <div className="reviews-list">
              {reviews
                .filter((review) => review.status !== "pending")
                .map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirm Modal */}
      <div className="modal fade" id="deleteReviewModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Review</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                ref={deleteModalCloseRef}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete review by{" "}
                <strong>"{deleteTarget?.name || deleteTarget?.email}"</strong>?
                This cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="cancel-btn"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="save-btn"
                style={{ background: "var(--danger, #e74c3c)" }}
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReviews;