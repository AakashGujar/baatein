/* eslint-disable no-unused-vars */
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async ({ username, password }) => {
    const success = handleInputErrors({ username, password });
    if (!success) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", {
        username, password
      });

      const data = res.data;
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
}

function handleInputErrors({ username, password }) {
  if (!username || !password) {
    toast.error("Please fill in all required fields to continue.");
    return false;
  }
  return true;
}
