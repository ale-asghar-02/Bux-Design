import { useContext, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { updateProfile, getPublicProfile, userDeleteAccount, getAllMembers, accountToggleStatus, adminDeleteMember } from "../services/dashboardAPI";
import { toast } from "react-toastify";

const useDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);

  const handleUpdateProfile = async (profileData) => {
    setLoading(true);
    try {
      const data = await updateProfile(profileData);
      setUser(data.user);
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGetPublicProfile = async () => {
    setLoading(true);
    try {
      const data = await getPublicProfile();
      setUser(data.user);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUserDeleteAccount = async () => {
    setLoading(true);
    try {
      const data = await userDeleteAccount();
      toast.success(data.message || "Account deleted successfully");
      setUser(null);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllMembers = async () => {
    setLoading(true);
    try {
      const data = await getAllMembers();
      setMembers(data.members);
      return data.members;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountToggleStatus = async () => {
    setLoading(true);
    try {
      const response = await accountToggleStatus();
      setUser((prev) => ({ ...prev, isActive: response.isActive })); // ye line add karein
      toast.success(response.message);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDeleteMember = async (id) => {
    setLoading(true);
    try {
      const data = await adminDeleteMember(id);
      toast.success(data.message || "User deleted successfully");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    members,
    handleUpdateProfile,
    handleGetPublicProfile,
    handleUserDeleteAccount,
    handleGetAllMembers,
    handleAccountToggleStatus,
    handleAdminDeleteMember,
  };
};

export default useDashboard;