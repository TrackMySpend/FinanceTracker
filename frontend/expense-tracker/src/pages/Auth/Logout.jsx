import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const hasLoggedOut = useRef(false); // Ref to prevent double-run

  useEffect(() => {
    if (hasLoggedOut.current) return; // Already logged out
    hasLoggedOut.current = true;

    const confirmLogout = window.confirm("Are you sure you want to logout?");
    
    if (confirmLogout) {
      localStorage.removeItem("token");
      alert("Logged out successfully!");
      console.log("Logged out successfully");
      navigate("/login");
    } else {
      navigate(-1); // Go back if user cancels
    }
  }, [navigate]);

  return null;
};

export default Logout;
