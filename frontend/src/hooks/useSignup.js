/* eslint-disable no-unused-vars */
import { useAuthContext } from "../context/authContext";
import { useState } from "react";
import { toast } from "sonner";

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({ fullName, username, password, confirmPassword }) => {
    const success = handleInputErrors({ fullName, username, password, confirmPassword });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password, confirmPassword }),
      });

      const data = await res.json();
      if (data.error) {
				throw new Error(data.error);
			}

      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
      toast("Signup successful!");
    } catch (error) {
      toast(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
}


function handleInputErrors({ fullName, username, password, confirmPassword }) {
  if (!fullName || !username || !password || !confirmPassword) {
    toast("Please fill in all required fields to continue.");
    return false;
  }

  if (password !== confirmPassword) {
    toast("Passwords you entered do not match.");
    return false;
  }

  if (password.length < 6) {
    toast("Password must be at least 6 characters long.");
    return false;
  }
  return true;
}
