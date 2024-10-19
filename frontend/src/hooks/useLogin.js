/* eslint-disable no-unused-vars */
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { z } from "zod";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async ({ username, password }) => {
        setLoading(true);
        try {
            const validationResult = loginSchema.safeParse({ username, password });

            if (!validationResult.success) {
                validationResult.error.errors.forEach(err => toast.error(err.message));
                return;
            }

            const res = await axios.post("/api/auth/login", {
                username, password,
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
