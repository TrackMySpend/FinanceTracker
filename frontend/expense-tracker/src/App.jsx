import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Expense from "./pages/Dashboard/Expense";
import Income from "./pages/Dashboard/Income";
import UserProvider from "./context/UserContext"; 
import { Toaster } from "react-hot-toast";
import Logout from "./pages/Auth/Logout";
import SettingPage from "./pages/Dashboard/SettingPage";
import { useThemeStore } from "./pages/store/useThemeStore"; // Assuming you have a theme store
import { useEffect } from "react";
const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <UserProvider>
      <div>

 <Router>
      
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
<Route path="/logout" element={<Logout />} />
<Route path="/settings" element={<SettingPage />} />

        </Routes>
     
    </Router>
      </div>

      <Toaster 
      toastOptions={{
        className: "",
        style:{
          fontSize:'13px'

        },
      }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};
