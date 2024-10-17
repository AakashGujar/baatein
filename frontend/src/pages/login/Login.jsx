/* eslint-disable react/prop-types */
"use client";
import { cn } from "@/lib/utils";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login } = useLogin(); 

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Login form submitted");
    await login({ username, password });
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-lg p-4 md:p-8 shadow-input bg-black bg-opacity-60">
      <h2 className="font-bold text-2xl text-neutral-200">Welcome Back</h2>
      <p className="text-neutral-400 text-sm max-w-sm mt-2 text-neutral-300">
        Log in to continue chatting with your friends and making new
        connections.
      </p>
      <form className="mt-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter your username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black from-zinc-900 to-zinc-900 to-neutral-600 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium  shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={loading}
        >
           {loading ? "Logging in..." : "Log in"}
          <BottomGradient />
        </button>

        <p className="text-neutral-400 text-sm max-w-sm mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="hover:text-blue-400">
            Sign Up Here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
