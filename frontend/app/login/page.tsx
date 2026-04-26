"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] = useState("");

  const login = () => {
    if (
      email === "admin@rapidaid.com" &&
      password === "admin123"
    ) {
      localStorage.setItem("role", "admin");
      router.push("/admin");
      return;
    }

    if (
      email === "driver@rapidaid.com" &&
      password === "driver123"
    ) {
      localStorage.setItem("role", "driver");
      router.push("/driver");
      return;
    }

    setError("Invalid credentials");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-[400px] h-[400px] bg-red-600/20 blur-3xl rounded-full top-20 left-10"></div>
      <div className="absolute w-[300px] h-[300px] bg-blue-600/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative z-10 w-full max-w-md bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-5xl font-bold text-red-500 mb-2">
          Login
        </h1>

        <p className="text-zinc-400 mb-8">
          RapidAid Secure Access Portal
        </p>

        <input
          className="w-full p-3 bg-zinc-800 rounded-xl mb-4 outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          className="w-full p-3 bg-zinc-800 rounded-xl mb-4 outline-none"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={login}
          className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-xl font-bold"
        >
          Login
        </button>

        {error && (
          <p className="text-red-400 mt-4">
            {error}
          </p>
        )}

        <p className="text-zinc-500 text-sm text-center mt-6">
          Authorized Personnel Only
        </p>
      </div>
    </main>
  );
}