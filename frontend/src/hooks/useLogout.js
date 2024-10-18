/* eslint-disable no-unused-vars */
import { toast } from "sonner";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/logout");
      const data = res.data;
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.removeItem("chat-user");
      setAuthUser(null);
      toast.success("Logged out successfully!");

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
}