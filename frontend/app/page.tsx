"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const submitEmergency = async () => {
    if (!name || !type) {
      setMessage("Fill all fields");
      return;
    }

    await axios.post("http://localhost:5000/emergency", {
      name,
      type,
    });

    setMessage("Emergency Sent Successfully");
    setName("");
    setType("");
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute w-[500px] h-[500px] bg-red-600/20 blur-3xl rounded-full top-20 left-20"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-600/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative z-10 w-full max-w-xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-5xl font-bold text-red-500 mb-2">
          RapidAid
        </h1>

        <p className="text-zinc-400 mb-6">
          Realtime Emergency Dispatch Platform
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-zinc-800 p-3 rounded-xl text-center">
            <p className="text-red-400 text-xl font-bold">
              24/7
            </p>
            <p className="text-xs text-zinc-400">
              Response
            </p>
          </div>

          <div className="bg-zinc-800 p-3 rounded-xl text-center">
            <p className="text-green-400 text-xl font-bold">
              LIVE
            </p>
            <p className="text-xs text-zinc-400">
              Tracking
            </p>
          </div>

          <div className="bg-zinc-800 p-3 rounded-xl text-center">
            <p className="text-blue-400 text-xl font-bold">
              FAST
            </p>
            <p className="text-xs text-zinc-400">
              Dispatch
            </p>
          </div>
        </div>

        <input
          className="w-full p-3 rounded-xl bg-zinc-800 mb-4 outline-none"
          placeholder="Your Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <select
          className="w-full p-3 rounded-xl bg-zinc-800 mb-4 outline-none"
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          <option value="">
            Select Emergency Type
          </option>
          <option value="Accident">
            Accident
          </option>
          <option value="Heart Attack">
            Heart Attack
          </option>
          <option value="Fire Injury">
            Fire Injury
          </option>
          <option value="Critical Care">
            Critical Care
          </option>
        </select>

        <button
          onClick={submitEmergency}
          className="w-full bg-red-600 hover:bg-red-700 transition p-3 rounded-xl font-bold"
        >
          Request Ambulance
        </button>

        {message && (
          <p className="mt-4 text-green-400">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}