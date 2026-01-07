import React, { useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../services/api";

const Auth = () => {
  const { setAuth } = useApp(); // ✅ FIX
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const res = await api.post("/auth/login", { email, password });
        const { user, token } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setAuth(user, token);

        toast.success(`Login successful 🎉 Welcome ${user.name}`);
        navigate("/");
      }

      if (mode === "signup") {
        const res = await api.post("/auth/register", {
          name,
          email,
          password,
        });

        const { user, token } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setAuth(user, token);

        toast.success("Account created successfully ");
        navigate("/");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong ";

      toast.error(msg);
      setError(msg); // keep existing UI error also
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    alert("Password reset link sent to your email (mock)");
    setMode("login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-indigo-600 font-bold text-2xl">N</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to Nexus
            </h2>
            <p className="text-indigo-100">Project Management Reimagined</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {mode === "login" && "Sign in to your account"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset your password"}
          </h3>

          {/* {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )} */}

          {mode !== "forgot" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  required
                />
              </div>

              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {mode === "forgot" && (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white"
              />

              <button
                onClick={handleForgotPassword}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg"
              >
                Send Reset Link
              </button>

              <button
                onClick={() => setMode("login")}
                className="w-full text-sm text-gray-400 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {mode !== "forgot" && (
            <div className="mt-6 text-center text-sm text-gray-400">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-indigo-400 hover:underline ml-1"
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
              <button
                onClick={() => setMode("forgot")}
                className="block mt-3 text-indigo-400 hover:underline mx-auto"
              >
                Forgot password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
