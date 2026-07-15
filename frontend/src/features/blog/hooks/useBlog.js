import { useState, useContext } from "react";
import { createBlog, getAllBlogs, getAllMyBlogs, updateBlog, deleteBlog } from "../services/blogAPI";
import { toast } from "react-toastify";

const useBlog = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState([]);

  const handleCreateBlog = async (blogData) => {
    setLoading(true);
    try {
      await createBlog(blogData);
      toast.success("Blog created successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogs();
      setBlogs(data.data || data.blogs || data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch all blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllMyBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllMyBlogs();
      setBlog(data.data || data.blogs || data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch my blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBlog = async (id, blogData) => {
    setLoading(true);
    try {
      const data = await updateBlog(id, blogData);
      const updatedBlog = data.data || data.blog || data;
      setBlog((prev) => prev.map((b) => (b._id === id ? updatedBlog : b)));
      toast.success("Blog updated successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    setLoading(true);
    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      toast.success("Blog deleted successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    blogs,
    blog,
    handleCreateBlog,
    handleGetAllBlogs,
    handleGetAllMyBlogs,
    handleUpdateBlog,
    handleDeleteBlog,
  };
};

export default useBlog;