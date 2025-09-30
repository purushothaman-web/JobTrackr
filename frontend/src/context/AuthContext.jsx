import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

// ✅ Export global Axios instance so other components can use it
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Create context
const AuthContext = createContext();

// ✅ Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${parsedUser.token}`;

        const response = await api.get("/auth/me");

        const freshUser = {
          ...parsedUser,
          name: response.data.name,
          email: response.data.email,
          emailVerified: response.data.emailVerified, // ✅ Ensure backend returns this
        };

        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      } catch (err) {
        console.error("AuthContext: Failed to fetch profile", err);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Register
  const register = async (data) => {
    try {
      const response = await api.post("/auth/register", data);
      if (response.data.success) {
        const user = {
          id: response.data.data.id,
          name: response.data.data.name,
          email: response.data.data.email,
          token: response.data.data.token,
          emailVerified: response.data.data.emailVerified,
        };
        setUser(user);
        setError(null);
        localStorage.setItem("user", JSON.stringify(user));
        api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
        return response;
      } else {
        setError(response.data.error || "Registration failed");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        setError("Too many requests. Please try again later.");
      } else {
        setError(error.response?.data?.error || error.message || "Registration failed");
      }
    }
  };

  // ✅ Login
  const login = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      if (response.data.success) {
        const user = {
          id: response.data.data.id,
          name: response.data.data.name,
          email: response.data.data.email,
          token: response.data.data.token,
          emailVerified: response.data.data.emailVerified,
        };
        setUser(user);
        setError(null);
        localStorage.setItem("user", JSON.stringify(user));
        api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
        return response;
      } else {
        setError(response.data.error || "Login failed");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        setError("Too many requests. Please try again later.");
      } else {
        setError(error.response?.data?.error || error.message || "Login failed");
      }
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout failed or already expired");
    }
    setUser(null);
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        api, // ✅ provide global axios instance
        setUser, // Expose setUser for OAuth callback
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
  // Update Profile
  const updateProfile = async (data) => {
    try {
      const response = await api.put("/auth/update-profile", data);
      if (response.data.success) {
        // Update local user state
        setUser((prev) => ({
          ...prev,
          name: response.data.data.name,
          email: response.data.data.email,
        }));
        setError(null);
        return response.data.data;
      } else {
        setError(response.data.error || "Profile update failed");
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || "Profile update failed");
    }
  };