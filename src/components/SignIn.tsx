"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [credsLoading, setCredsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err: any) {
      setError("Google sign in failed. Try again.");
      setLoading(false);
    }
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setCredsLoading(true);
    setError(null);
    setSuccess(null);

    if (isSignup) {
      try {
        const res = await axios.post("/api/register", {
          name,
          email,
          password,
        });
        if (!res.data) {
          setError("Unexpected response");
          setCredsLoading(false);
          return;
        }
        setSuccess("Account created. Signing you in...");

        // auto-sign-in after signup
        const signRes: any = await signIn("credentials", {
          redirect: false,
          email,
          password,
        } as any);

        if (signRes?.error) {
          setError(signRes.error || "Sign in after signup failed");
          setCredsLoading(false);
          return;
        }

        router.push("/dashboard");
      } catch (err: any) {
        setError(err?.response?.data?.error || "Signup error");
      } finally {
        setCredsLoading(false);
      }
    } else {
      try {
        const res: any = await signIn("credentials", {
          redirect: false,
          email,
          password,
        } as any);

        if (res?.error) {
          console.log(res);
          setError("User doesn't exist");
          setCredsLoading(false);
          return;
        }

        router.push("/dashboard");
      } catch (err: any) {
        setError(err?.message || "Sign in error");
      } finally {
        setCredsLoading(false);
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-100">
          <div className="flex flex-col items-center gap-6">
            {error ? (
              <div className="w-full text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-4 py-2">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="w-full text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-4 py-2">
                {success}
              </div>
            ) : null}

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-lg py-3 px-4 border hover:bg-gray-50 cursor-pointer bg-white text-slate-700"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.5h146.9c-6.4 34.1-26.3 62.9-56.2 82.1v67h90.6c53-48.8 84.2-121 84.2-193.2z"
                  fill="#4285F4"
                />
                <path
                  d="M272 544.3c76.8 0 141.4-25.5 188.5-69.4l-90.6-67c-25.3 17-57.8 27.1-97.9 27.1-75.2 0-138.9-50.8-161.6-119.2H17.6v74.8C64.2 481 161.3 544.3 272 544.3z"
                  fill="#34A853"
                />
                <path
                  d="M110.4 328.4c-8.6-25.3-8.6-52.7 0-78h-92.8v-74.8C3.8 205.5 0 240.8 0 276.4s3.8 70.9 17.6 101.7l92.8-74.8z"
                  fill="#FBBC05"
                />
                <path
                  d="M272 107.3c41.7 0 79.1 14.3 108.6 42.4l81.5-81.5C405.3 24.6 344.9 0 272 0 161.3 0 64.2 63.3 17.6 159.6l92.8 74.8C133.1 157.9 196.8 107.3 272 107.3z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-medium">
                {isSignup ? "Sign up with Google" : "Continue with Google"}
              </span>
            </button>

            <div className="flex items-center gap-3 w-full">
              <div className="h-px bg-slate-200 flex-1" />
              <div className="text-xs text-slate-400">or</div>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <form
              onSubmit={handleCredentials}
              className="w-full flex flex-col gap-3 text-slate-800"
            >
              {isSignup && (
                <>
                  <label className="text-sm text-slate-600">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="Your full name"
                    required
                  />
                </>
              )}

              <label className="text-sm text-slate-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="you@example.com"
                required
              />

              <label className="text-sm text-slate-600">Password</label>
              <input
                type="password"
                value={password}
                min={6}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Enter your password"
                required
              />

              <button
                type="submit"
                disabled={credsLoading}
                className="mt-2 w-full rounded-lg bg-slate-900 text-white py-2 font-medium hover:bg-slate-800 disabled:opacity-60"
              >
                {isSignup
                  ? credsLoading
                    ? "Signing up..."
                    : "Sign up"
                  : credsLoading
                  ? "Signing in..."
                  : "Sign in"}
              </button>

              <div className="text-sm text-slate-500 text-center">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignup(false);
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-slate-900 font-medium hover:underline cursor-pointer"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignup(true);
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-slate-900 font-medium hover:underline cursor-pointer"
                    >
                      Create account
                    </button>
                  </>
                )}
              </div>
            </form>
            <div className="text-xs text-slate-400">
              By continuing you agree to our Terms of Service
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
