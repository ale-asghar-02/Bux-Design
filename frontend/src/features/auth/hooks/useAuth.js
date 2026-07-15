import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { register, login, forgotPassword, resetPassword, logout, logoutAll, verifyGateCode, gateStatus, forgotGateCode, resetGateCode } from "../services/authAPI";
import { toast } from "react-toastify";

const useAuth = () => {
  const { loading, setLoading, user, setUser } = useContext(AuthContext);
  const [gateLoading, setGateLoading] = useState(false);

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register(username, email, password);
      setUser(data.user);
      toast.success("Registration successfully completed");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login(email, password);
      setUser(data.user);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async ({ email }) => {
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("Password reset verification link sent your email address");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Forgot password failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async ({ token, newPassword, confirmPassword }) => {
    setLoading(true);
    try {
      const data = await resetPassword(token, newPassword, confirmPassword);
      if (data?.user) setUser(data.user); // safe
      toast.success("Password reset successfully completed");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset password failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    setLoading(true);
    try {
      await logoutAll();
      setUser(null);
      toast.success('Logout all devices successfully.');
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout all failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyGateCode = async ({ code }) => {
    setGateLoading(true);
    try {
      await verifyGateCode(code);
      toast.success("Code verified successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid code");
    } finally {
      setGateLoading(false);
    }
  };

  const handleGateStatus = async () => {
    setGateLoading(true);
    try {
      await gateStatus();
      return true;
    } catch (error) {
      return false;
    } finally {
      setGateLoading(false);
    }
  };

  const handleForgotGateCode = async () => {
    setGateLoading(true);
    try {
      await forgotGateCode();
      toast.success("Reset link sent to admin email");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setGateLoading(false);
    }
  };

  const handleResetGateCode = async ({ token, newCode }) => {
    setGateLoading(true);
    try {
      await resetGateCode(token, newCode);
      toast.success("Code reset successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset gate code");
    } finally {
      setGateLoading(false);
    }
  };

  return {
    loading,
    user,
    handleRegister,
    handleLogin,
    handleForgotPassword,
    handleResetPassword,
    handleLogout,
    handleLogoutAll,
    handleVerifyGateCode,
    handleGateStatus,
    handleForgotGateCode,
    handleResetGateCode,
  };
};

export default useAuth;