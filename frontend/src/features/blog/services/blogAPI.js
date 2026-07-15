import api from "../../auth/services/authAPI";

export const createBlog = async (formData) => {
  const response = await api.post("/blog/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllBlogs = async () => {
  const response = await api.get("/blog/all");
  return response.data;
};

export const getAllMyBlogs = async () => {
  const response = await api.get("/blog/my-blogs");
  return response.data;
};

export const updateBlog = async (id, formData) => {
  const response = await api.post(`/blog/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await api.post(`/blog/delete/${id}`);
  return response.data;
};