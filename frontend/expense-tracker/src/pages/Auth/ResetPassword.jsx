import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/layouts/AuthLayout';
import axiosInstance from '../../utils/axiosInstance';


const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/auth/reset-password', { token, password });
      toast.success("Password reset successful. You can now log in.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto mt-16">
        <h2 className="text-2xl font-bold text-violet-700 mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New password"
            className="border px-4 py-2 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700"
          >
            Set New Password
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
