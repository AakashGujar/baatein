/* eslint-disable no-unused-vars */
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async ({ username, password }) => {
    const success = handleInputErrors({ username, password });
    if (!success) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
      toast("Logged in successful!");
    } catch (error) {
      toast(` ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
}

function handleInputErrors({ username, password }) {
  if (!username || !password) {
    toast("Please fill in all required fields to continue.");
    return false;
  }
  return true;
}
