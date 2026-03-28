"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <section className="relative w-full pt-20 md:pt-24 pb-8 flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Dokładnie taki sam gradient jak w globals.css (linear-gradient z czerwieni LGR do czerni) zamknięty tylko w sekcji Hero */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ background: 'linear-gradient(to bottom, var(--color-lgr-red), var(--color-lgr-black))' }}
      ></div>

      <motion.div
        style={{ scale, opacity }}
        className="relative z-10 flex flex-col items-center w-full px-4"
      >
        <motion.div
          initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="w-full max-w-[800px] flex items-center justify-center mix-blend-screen"
        >
          {/* Mniejsze wideo, ograniczone max-h, by zmieścić sekcję z kafelkami od razu na ekranie */}
          <video 
            src="/video/intro.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-auto max-h-[40vh] object-contain drop-shadow-[0_0_20px_rgba(180,0,15,0.3)]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
