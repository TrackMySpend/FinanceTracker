import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return setError("Please enter a valid email");
    if (!password) return setError("Please enter the password");

    setError("");
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen px-4 py-10 bg-gradient-to-tr from-purple-500 via-indigo-600 to-pink-500">
        <div className="w-full max-w-md glass-card p-10 shadow-xl animate-floating">
          <h3 className="text-4xl font-extrabold text-white mb-4 text-center drop-shadow-lg">
            Welcome Back
          </h3>
          <p className="text-base font-medium text-white/90 mb-8 text-center drop-shadow-sm">
            Login to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
              required
              className="focus:ring-purple-400 focus:border-purple-400 bg-white/20 text-white placeholder-white/70 border border-white/30"
              labelClassName="text-white font-semibold"
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
              required
              className="focus:ring-purple-400 focus:border-purple-400 bg-white/20 text-white placeholder-white/70 border border-white/30"
              labelClassName="text-white font-semibold"
            />

            {error && (
              <p className="text-sm text-red-300 font-semibold text-center drop-shadow">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600
              text-white font-bold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700
              transition duration-300 ease-in-out uppercase tracking-wider"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/80">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-purple-200 hover:text-purple-100 underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Floating + Glassmorphism Styles */}
      <style>{`
        @keyframes floating {
          0%, 100% {
            transform: translateY(0);
            box-shadow: 0 0 20px rgba(128, 90, 213, 0.3), 0 0 40px rgba(128, 90, 213, 0.2);
          }
          50% {
            transform: translateY(-15px);
            box-shadow: 0 0 40px rgba(128, 90, 213, 0.5), 0 0 60px rgba(128, 90, 213, 0.3);
          }
        }
        .animate-floating {
          animation: floating 4s ease-in-out infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow:
            0 4px 30px rgba(255, 255, 255, 0.1),
            0 0 15px rgba(128, 90, 213, 0.3);
          transition: box-shadow 0.3s ease;
        }
        .glass-card:hover {
          box-shadow:
            0 8px 40px rgba(255, 255, 255, 0.2),
            0 0 60px rgba(128, 90, 213, 0.6);
        }
        .glass-card * {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </AuthLayout>
  );
};

export default Login;
