"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard({ userExist }: any) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  if (!userExist) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 text-lg">
        No user data found
      </div>
    );
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/api/user");
        const data = res.data;
        if (!data) {
          setLoading(false);
          return;
        }
        setUser(data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 text-lg">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 text-lg">
        No user data found
      </div>
    );
  }

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-6">
      <div className="max-w-sm w-full bg-white/95 shadow-2xl rounded-2xl p-8 border border-slate-100 text-center">
        {user.image ? (
          <img
            src={user.image}
            alt="profile"
            className="w-24 h-24 rounded-full mx-auto object-cover shadow"
          />
        ) : (
          <div className="w-24 h-24 mx-auto rounded-full bg-slate-800 text-white flex items-center justify-center text-4xl font-semibold shadow">
            {firstLetter}
          </div>
        )}

        <h1 className="mt-4 text-2xl font-semibold text-slate-900">
          {user.name}
        </h1>
        <p className="text-slate-500 mt-1">{user.email}</p>

        <div className="border-t mt-2 pt-2 flex justify-center gap-1">
          <Link
            href="/edit"
            className="px-14 py-2 rounded bg-slate-700 text-slate-100 w-full"
          >
            Edit
          </Link>
        </div>
      </div>
    </main>
  );
}
