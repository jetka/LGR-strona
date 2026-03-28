"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Hidden anti-bot field
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      honeypot, // Sent to server — bots fill this, humans don't
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#1a0002] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8B0000] via-[#2A0000] to-black opacity-90 z-0"></div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo_red.png" alt="LGR Logo" width={100} height={40} className="mb-4" />
          <h1 className="text-2xl font-bold uppercase tracking-widest text-white">Logowanie</h1>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-500/50 text-red-200 p-3 rounded text-sm text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-lgr-red)] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Hasło</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-lgr-red)] focus:outline-none transition-colors"
            />
          </div>

          {/* Honeypot — invisible to humans, bots auto-fill it */}
          <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
            <input 
              type="text" 
              name="company_url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full px-6 py-3 bg-[var(--color-lgr-red)] hover:bg-red-700 disabled:opacity-50 text-white font-bold uppercase tracking-wide rounded-lg transition-colors"
          >
            {loading ? "Weryfikacja..." : "Zaloguj się"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
