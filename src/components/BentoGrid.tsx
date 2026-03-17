"use client";

import { motion, Variants } from "framer-motion";
import dynamic from "next/dynamic";
import { Users, CalendarDays, ArrowRight, Play } from "lucide-react";

// Dynamically import map to avoid window is not defined error
const GPXMap = dynamic(() => import("./GPXMap"), { ssr: false });

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function BentoGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 selection:bg-[var(--color-lgr-red)] selection:text-white">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ staggerChildren: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[600px] auto-rows-[300px]"
      >
        {/* Large Item: Ostatni Start */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-2 row-span-1 md:row-span-1 bg-gradient-to-br from-[#1A1A1A] to-black rounded-3xl p-8 border border-white/5 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-lgr-red)] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity"></div>
          
          <div>
            <div className="inline-block px-3 py-1 bg-[var(--color-lgr-red)] text-white text-xs font-bold mb-4 rounded uppercase tracking-wider">Na Żywo</div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Ostatni Start</h2>
          </div>
          
          <div className="mt-8 flex items-end gap-4">
            <span className="text-8xl md:text-[10rem] font-bold text-white leading-none tracking-tighter">1</span>
            <div className="pb-4">
              <span className="block text-[var(--color-lgr-red)] font-black text-2xl uppercase">Miejsce</span>
              <span className="text-gray-400 text-sm">Maraton MTB Limanowa 2024</span>
            </div>
          </div>
        </motion.div>

        {/* Square Item: GPX Map */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-2 row-span-1 md:row-span-1 rounded-3xl border border-white/5 relative bg-[#1A1A1A]"
        >
          <GPXMap />
        </motion.div>

        {/* Standard Video item */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-1 row-span-1 bg-[#1A1A1A] rounded-3xl p-6 border border-white/5 flex flex-col justify-end relative overflow-hidden group cursor-pointer"
        >
          {/* We'd use a real Next/Image here normally */}
          <div className="absolute inset-0 bg-neutral-900 group-hover:scale-105 transition-transform duration-700 bg-[url('https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/30 group-hover:bg-[var(--color-lgr-red)] transition-colors">
              <Play className="text-white ml-1" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wide">Najnowszy Film</h3>
            <p className="text-xs text-gray-300 uppercase tracking-widest mt-1">Downhill Session 2024</p>
          </div>
        </motion.div>

        {/* Wide Member Card */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-3 row-span-1 bg-[#1A1A1A] rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          
          <div className="relative z-10 max-w-sm">
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">LGR Team</h3>
            <p className="text-gray-300 text-sm mb-6">Poznaj ludzi, którzy tworzą tę historię. Ponad 50 pasjonatów w jednej drużynie.</p>
            <button className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-sm rounded hover:bg-gray-200 transition-colors">
              Zobacz Galerię
            </button>
          </div>
          
          <div className="relative z-10 mt-6 md:mt-0 flex gap-4">
            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-3">
              <Users className="text-[var(--color-lgr-red)]" size={24} />
              <div>
                <span className="block text-2xl font-bold text-white leading-none">52</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Członków</span>
              </div>
            </div>
            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-3">
              <CalendarDays className="text-[var(--color-lgr-red)]" size={24} />
              <div>
                <span className="block text-2xl font-bold text-white leading-none">Sb 9:00</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Trening</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
