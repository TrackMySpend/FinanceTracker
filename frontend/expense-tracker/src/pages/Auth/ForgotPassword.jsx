import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/layouts/AuthLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Email is required");

    try {
     await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });

      toast.success("Password reset link sent to your email.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto mt-16">
        <h2 className="text-2xl font-bold text-violet-700 mb-4">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="you@example.com"
            className="border px-4 py-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
