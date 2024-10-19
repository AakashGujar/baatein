import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { z } from "zod";

const signupSchema = z.object({
    fullName: z.string().min(1),
    username: z.string().min(1),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
});

export function useSignup() {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ fullName, username, password, confirmPassword }) => {
        setLoading(true);
        try {
            const validationResult = signupSchema.safeParse({ fullName, username, password, confirmPassword });

            if (!validationResult.success) {
                validationResult.error.errors.forEach(err => toast.error(err.message));
                return;
            }

            if (password !== confirmPassword) {
                toast.error("Passwords you entered do not match.");
                return;
            }

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
