"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function OrangeNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="py-5 px-4 md:px-10 bg-slate-700 text-white">
      <div className="flex items-center justify-evenly gap-4">
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="font-semibold tracking-wide">
            Home
          </Link>
          <Link href="/dashboard" className=" hover:underline">
            Dashboard
          </Link>
          <Link href="/edit" className=" hover:underline">
            Edit
          </Link>

          <Link
            href="/register"
            className="px-6 py-2 rounded bg-slate-300 text-slate-900 font-semibold"
          >
            Register
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/register" })}
            className="px-6 py-2 rounded bg-slate-300 text-slate-900 font-semibold cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="toggle menu"
            className="font-semibold cursor-pointer"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-slate-700 border-t px-4 py-3 mt-2">
          <div className="flex flex-col gap-2">
            <Link href="/" className=" font-medium">
              Home
            </Link>
            <Link href="/dashboard" className=" font-medium">
              Dashboard
            </Link>
            <Link href="/edit" className=" font-medium">
              Edit
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 rounded bg-slate-300 text-slate-900 font-semibold inline-block w-max"
            >
              Register
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/register" })}
              className="px-6 py-2 rounded bg-slate-300 text-slate-900 font-semibold
              inline-block w-max cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
