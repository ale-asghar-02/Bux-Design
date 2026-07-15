import { useContext, useState } from "react";
import { createQuote, getAllQuote, updateQuoteStatus, deleteSingleQuote } from "../services/quoteAPI";
import { toast } from "react-toastify";

const useQuote = () => {
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState(null);

  const handleCreateQuote = async (quoteData) => {
    setLoading(true);
    try {
      await createQuote(quoteData);
      toast.success("Quote request submitted successfully");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit quote request",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllQuotes = async () => {
    setLoading(true);
    try {
      const data = await getAllQuote();
      setQuotes(data.data || data.quotes || data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch quotes");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuoteStatus = async (id, status) => {
    setLoading(true);
    try {
      const data = await updateQuoteStatus(id, status);
      const updatedQuote = data.data || data.quote || data;
      setQuotes((prev) => prev.map((q) => (q._id === id ? updatedQuote : q)));
      toast.success("Quote status updated successfully");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update quote status",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuote = async (id) => {
    setLoading(true);
    try {
      await deleteSingleQuote(id);
      setQuotes((prev) => prev.filter((q) => q._id !== id));
      toast.success("Quote deleted successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete quote");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    quotes,
    quote,
    handleCreateQuote,
    handleGetAllQuotes,
    handleUpdateQuoteStatus,
    handleDeleteQuote,
  };
};

export default useQuote;