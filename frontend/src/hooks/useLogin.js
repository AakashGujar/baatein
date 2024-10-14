/* eslint-disable no-unused-vars */
import { useAuthContext } from "../context/authContext";
import { useState } from "react";
import { toast } from "sonner"; 

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async ({  username, password }) => {
    const success = handleInputErrors({username, password });
    if (!success) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login Failed");
      }

      toast("✅ Logged in successful!");
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast(`❌ ${error.message || "Login failed. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
}

function handleInputErrors({ username, password}) {
  if (!username || !password) {
    toast("⚠️ Please fill in all required fields to continue.");
    return false;
  }
  return true;
}
