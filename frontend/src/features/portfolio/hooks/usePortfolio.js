import { useState, useContext } from "react";
import { createPortfolio, getAllPortfolios, getAllMyPortfolios, updatePortfolio, deletePortfolio } from "../services/portfolioAPI";
import { toast } from "react-toastify";

const usePortfolio = () => {
  const [loading, setLoading] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  const handleCreatePortfolio = async (formData) => {
    setLoading(true);
    try {
      await createPortfolio(formData);
      toast.success("Portfolio created successfully");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create portfolio",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllPortfolios = async () => {
    setLoading(true);
    try {
      const data = await getAllPortfolios();
      setPortfolios(data.data || data.portfolios || data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch portfolios",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllMyPortfolios = async () => {
    setLoading(true);
    try {
      const data = await getAllMyPortfolios();
      setPortfolio(data.data || data.portfolios || data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch my portfolios",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePortfolio = async (id, formData) => {
    setLoading(true);
    try {
      const data = await updatePortfolio(id, formData);
      const updatedPortfolio = data.data || data.portfolio || data;
      setPortfolio((prev) =>
        prev.map((p) => (p._id === id ? updatedPortfolio : p)),
      );
      toast.success("Portfolio updated successfully");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update portfolio",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = async (id) => {
    setLoading(true);
    try {
      await deletePortfolio(id);
      setPortfolios((prev) => prev.filter((p) => p._id !== id));
      toast.success("Portfolio deleted successfully");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete portfolio",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    portfolios,
    portfolio,
    handleCreatePortfolio,
    handleGetAllPortfolios,
    handleGetAllMyPortfolios,
    handleUpdatePortfolio,
    handleDeletePortfolio,
  };
};

export default usePortfolio;
