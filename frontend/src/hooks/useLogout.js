/* eslint-disable no-unused-vars */
import { toast } from "sonner";
import { useState } from "react";
import { useAuthContext } from "../context/authContext";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.removeItem("chat-user");
      setAuthUser(null);
      toast("Logged out successfully!");

    } catch (error) {
      toast(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
}