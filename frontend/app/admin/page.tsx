"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

type EmergencyItem = {
  id: number;
  name: string;
  type: string;
  status: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [items, setItems] = useState<EmergencyItem[]>([]);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      router.push("/login");
      return;
    }

    loadData();

    socket.on("newEmergency", (data: EmergencyItem) => {
      setItems((prev) => [data, ...prev]);
      setAlert(`🚨 New Emergency: ${data.name} - ${data.type}`);

      setTimeout(() => {
        setAlert("");
      }, 4000);
    });

    socket.on(
      "statusChanged",
      ({ id, status }: { id: number; status: string }) => {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status } : item
          )
        );
      }
    );

    return () => {
      socket.off("newEmergency");
      socket.off("statusChanged");
    };
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/emergencies"
      );
      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = (
    id: number,
    status: string
  ) => {
    socket.emit("updateStatus", { id, status });
  };

  const logout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  const pendingCount = items.filter(
    (i) => i.status === "Pending"
  ).length;

  const completedCount = items.filter(
    (i) => i.status === "Completed"
  ).length;

  const activeCount = items.filter(
    (i) => i.status !== "Completed"
  ).length;

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-red-500">
          Admin Command Center
        </h1>

        <button
          onClick={logout}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      <p className="text-zinc-400 mb-6">
        Real-Time Emergency Monitoring Dashboard
      </p>

      {alert && (
        <div className="bg-red-600 p-4 rounded-xl mb-6 animate-pulse font-bold">
          {alert}
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 p-5 rounded-xl">
          <p className="text-zinc-400">Total Requests</p>
          <h2 className="text-3xl font-bold">{items.length}</h2>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl">
          <p className="text-zinc-400">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-400">
            {pendingCount}
          </h2>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl">
          <p className="text-zinc-400">Completed</p>
          <h2 className="text-3xl font-bold text-green-400">
            {completedCount}
          </h2>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl">
          <p className="text-zinc-400">Active</p>
          <h2 className="text-3xl font-bold text-red-400">
            {activeCount}
          </h2>
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl"
          >
            <h2 className="text-xl font-bold">
              {item.name}
            </h2>

            <p className="text-zinc-400 mt-1">
              {item.type}
            </p>

            <p className="mt-3">
              Status:
              <span className="ml-2 text-green-400 font-semibold">
                {item.status}
              </span>
            </p>

            <div className="flex gap-2 flex-wrap mt-4">
              <button
                onClick={() =>
                  updateStatus(item.id, "Assigned")
                }
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded"
              >
                Assign
              </button>

              <button
                onClick={() =>
                  updateStatus(item.id, "En Route")
                }
                className="bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded"
              >
                En Route
              </button>

              <button
                onClick={() =>
                  updateStatus(item.id, "Completed")
                }
                className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded"
              >
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}