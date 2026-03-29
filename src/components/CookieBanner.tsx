"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    const accepted = localStorage.getItem("lgr-cookies-accepted");
    if (!accepted) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("lgr-cookies-accepted", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4"
        >
          <div className="max-w-4xl mx-auto bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl p-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl">
            <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed">
              Strona korzysta z plików cookies (ciasteczek), aby zapewnić najlepszą jakość korzystania z serwisu. 
              Dalsze korzystanie ze strony oznacza zgodę na ich użycie.
            </p>
            <button
              onClick={handleAccept}
              className="bg-[var(--color-lgr-red)] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded transition-colors whitespace-nowrap"
            >
              Rozumiem
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
