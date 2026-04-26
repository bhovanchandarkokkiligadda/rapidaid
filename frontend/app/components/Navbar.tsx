"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-red-500">
        RapidAid
      </h1>

      <div className="flex gap-6 text-sm">
        <Link href="/" className="hover:text-red-400">
          Home
        </Link>

        <Link
          href="/admin"
          className="hover:text-red-400"
        >
          Admin
        </Link>

        <Link
          href="/driver"
          className="hover:text-red-400"
        >
          Driver
        </Link>
      </div>

      <div className="text-green-400 text-sm font-semibold">
        ● LIVE
      </div>
    </nav>
  );
}