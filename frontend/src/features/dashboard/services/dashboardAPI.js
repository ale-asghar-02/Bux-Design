import api from "../../auth/services/authAPI";

export const getMe = async () => {
  const response = await api.get("/user/get-me");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.post("/user/update-profile", profileData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getPublicProfile = async () => {
  const response = await api.get("/user/public");
  return response.data;
};

export const userDeleteAccount = async () => {
  const response = await api.post("/user/delete-account");
  return response.data;
};

export const getAllMembers = async () => {
  const response = await api.get("/user/members/all");
  return response.data;
};

export const accountToggleStatus = async () => {
  const response = await api.post("/user/toggle-status");
  return response.data;
};

export const adminDeleteMember = async (id) => {
  const response = await api.post(`/user/delete-account/${id}`);
  return response.data;
};