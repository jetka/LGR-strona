"use client";

import { motion } from "framer-motion";

const PARTNERS = [
  { name: "Gmina Słopnice", logo: "http://localhost:8080/sponsorzy/slopnice.png" },
  { name: "Sportman", logo: "http://localhost:8080/sponsorzy/sportman.png" },
  { name: "LGR Limanowa", text: "LGR" },
  { name: "Małopolska", text: "MAŁOPOLSKA" },
  { name: "Bike Limanowa", text: "BIKE" },
  { name: "LGR Team", text: "#LGRTEAM" },
];

export default function PartnersTicker() {
  const tickerItems = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="w-full py-20 bg-black/50 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10 text-center">
        <span className="text-[var(--color-lgr-red)] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Zaufali Nam</span>
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Partnerzy Strategiczni</h2>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-12 md:gap-24 whitespace-nowrap min-w-max"
        >
          {tickerItems.map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default h-20 md:h-28"
            >
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="h-full w-auto object-contain px-2 md:px-4" />
              ) : (
                <span className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mr-4">
                  {partner.text}
                </span>
              )}
            </div>
          ))}
        </motion.div>
        
        {/* Gradients on edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
      </div>
    </section>
  );
}
