"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Edit({ userExist }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!userExist) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 text-lg">
        You must be signed in to edit your profile.
      </div>
    );
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/user");
        const data = res.data;
        if (!data) {
          setError("Unable to load user (not authenticated).");
          setLoading(false);
          return;
        }
        setUser(data.user);
        setEmail(data.user.email ?? "");
      } catch (err) {
        console.error(err);
        setError("Unexpected error loading user.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">
          You must be signed in to edit your profile.
        </div>
      </div>
    );
  }

  const userHasPassword =
    typeof user.passwordExists === "boolean" ? user.passwordExists : false;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword && newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (userHasPassword && newPassword && !currentPassword) {
      setError("Current password is required to change password");
      return;
    }

    const payload: Record<string, any> = {};
    if (email !== user?.email) payload.email = email;
    if (name) payload.name = name;
    if (image) payload.image = image;

    if (newPassword) {
      payload.newPassword = newPassword;
      if (userHasPassword) payload.currentPassword = currentPassword;
    }

    if (Object.keys(payload).length === 0) {
      setError("No changes to update");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.patch("/api/user", payload);
      const data = res.data;
      console.log(data);
      if (!data) {
        setError(data?.error || "Update failed");
        setSubmitting(false);
        return;
      }
      setSuccess("Profile updated");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <h1 className="text-2xl font-semibold text-slate-900 text-center">
          Edit Profile
        </h1>

        {error && (
          <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-4 py-2">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-4 py-2">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-3 text-slate-800"
        >
          <label className="text-sm text-slate-600">Full name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />

          <label className="text-sm text-slate-600">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            // required
            className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />

          <label className="text-sm text-slate-600">Image URL</label>
          <input
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />

          <div className="pt-2 border-t border-slate-100"></div>

          <h2 className="text-sm font-medium text-slate-800">
            Change password
          </h2>
          <p className="text-xs text-slate-500 mb-2">
            {userHasPassword
              ? "Provide current password to set a new one."
              : "You signed up using Google. Provide a new password to enable credentials sign-in."}
          </p>

          {userHasPassword && (
            <>
              <label className="text-sm text-slate-600">Current password</label>
              <input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                type="password"
                className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </>
          )}

          <label className="text-sm text-slate-600">New password</label>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 8 chars)"
            type="password"
            className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 w-full rounded-lg bg-slate-900 text-white py-2 font-medium hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Saving..." : "Save changes"}
          </button>

          <div className="text-sm text-slate-500 text-center mt-2">
            Your changes will take effect immediately.
          </div>
        </form>
      </div>
    </main>
  );
}
