import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) return toast.error("Password is required");

    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        token,
        newPassword,
      });

      toast.success("Password reset successful");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token");
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  return (
    <div className="max-w-md mx-auto mt-16">
      <h2 className="text-2xl font-bold text-violet-700 mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Enter new password"
          className="border px-4 py-2 rounded-md"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
