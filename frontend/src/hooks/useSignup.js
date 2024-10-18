  /* eslint-disable no-unused-vars */
  import { useAuthContext } from "../context/AuthContext";
  import { useState } from "react";
  import { toast } from "sonner";
  import axios from "axios";

  export function useSignup() {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ fullName, username, password, confirmPassword }) => {
      const success = handleInputErrors({ fullName, username, password, confirmPassword });
      if (!success) return;

      setLoading(true);
      try {
        const res = await axios.post("/api/auth/signup", {
          fullName, username, password, confirmPassword,
        });

        const data = res.data;
        if (data.error) {
          throw new Error(data.error);
        }

        localStorage.setItem("chat-user", JSON.stringify(data));
        setAuthUser(data);
        toast.success("Signup successful!");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    return { loading, signup };
  }


  function handleInputErrors({ fullName, username, password, confirmPassword }) {
    if (!fullName || !username || !password || !confirmPassword) {
      toast.error("Please fill in all required fields to continue.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords you entered do not match.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  }
