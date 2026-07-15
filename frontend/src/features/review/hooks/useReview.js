import { useState } from "react";
import { generateReviewLink, submitReview, getAllReviews, getApprovedReviews, updateReviewStatus, deleteReview } from "../services/reviewAPI";
import { toast } from "react-toastify";

const useReview = () => {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);

  const handleGenerateReviewLink = async (email) => {
    setLoading(true);
    try {
      await generateReviewLink(email);
      toast.success("Review link sent successfully");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send review link",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (token, formData) => {
    setLoading(true);
    try {
      await submitReview(token, formData);
      toast.success("Review submitted successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data.data || data.reviews || data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleGetApprovedReviews = async () => {
    setLoading(true);
    try {
      const data = await getApprovedReviews();
      setApprovedReviews(data.data || data.reviews || data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch approved reviews",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReviewStatus = async (id, status) => {
    setLoading(true);
    try {
      const data = await updateReviewStatus(id, status);
      const updatedReview = data.data || data.review || data;
      setReviews((prev) => prev.map((r) => (r._id === id ? updatedReview : r)));
      toast.success(`Review ${status} successfully`);
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update review status",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    setLoading(true);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    reviews,
    approvedReviews,
    handleGenerateReviewLink,
    handleSubmitReview,
    handleGetAllReviews,
    handleGetApprovedReviews,
    handleUpdateReviewStatus,
    handleDeleteReview,
  };
};

export default useReview;