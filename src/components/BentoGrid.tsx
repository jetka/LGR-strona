"use client";

import { motion, Variants } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Users, CalendarDays, ArrowRight, Play } from "lucide-react";
import { getMediaUrl } from "@/lib/media";

// Dynamically import map to avoid window is not defined error
const GPXMap = dynamic(() => import("./GPXMap"), { ssr: false });

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function BentoGrid({ 
  latestRoute,
  latestStart,
  latestMedia,
  latestEvent
}: { 
  latestRoute?: any;
  latestStart?: any;
  latestMedia?: any;
  latestEvent?: any;
}) {
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
        <Link href={latestStart ? `/starty/${latestStart.slug}` : "#"} className="col-span-1 md:col-span-2 row-span-1 md:row-span-1 block h-full">
          <motion.div 
            variants={itemVariants}
            className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-black rounded-3xl p-8 border border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--color-lgr-red)]/50 transition-colors"
          >
            {latestStart?.imageUrls?.[0] && (
              <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700" style={{ backgroundImage: `url(${getMediaUrl(latestStart.imageUrls[0])})`}}></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-lgr-red)] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-[var(--color-lgr-red)] text-white text-xs font-bold mb-4 rounded uppercase tracking-wider">Ostatni Start</div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter line-clamp-2">{latestStart?.title || "Brak startów"}</h2>
            </div>
            
            <div className="relative z-10 mt-8 flex items-end gap-4">
              <span className="block text-[var(--color-lgr-red)] font-black text-xs uppercase tracking-widest">{latestStart ? new Date(latestStart.createdAt).toLocaleDateString("pl-PL") : ""}</span>
            </div>
          </motion.div>
        </Link>

        {/* Square Item: GPX Map */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-2 row-span-1 md:row-span-1 rounded-3xl border border-white/5 relative bg-[#1A1A1A] overflow-hidden group hover:border-[var(--color-lgr-red)]/50 transition-colors"
        >
          <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(/trasyBG.jpg)` }}></div>
          <GPXMap route={latestRoute} />
        </motion.div>

        {/* Standard Video item */}
        <Link href={latestMedia ? `/media/${latestMedia.slug}` : "#"} className="col-span-1 md:col-span-1 row-span-1 block h-full">
          <motion.div 
            variants={itemVariants}
            className="h-full bg-[#1A1A1A] rounded-3xl p-6 border border-white/5 flex flex-col justify-end relative overflow-hidden group cursor-pointer hover:border-[var(--color-lgr-red)]/50 transition-colors"
          >
            <div className="absolute inset-0 bg-neutral-900 group-hover:scale-105 transition-transform duration-700 overflow-hidden">
              {latestMedia?.imageUrls?.[0] ? (
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getMediaUrl(latestMedia.imageUrls[0])})` }}></div>
              ) : latestMedia?.videoUrl ? (
                <video 
                  src={`${getMediaUrl(latestMedia.videoUrl)}#t=1.0`} 
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)` }}></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </div>
            
            <div className="relative z-10">
              {latestMedia?.videoUrl && (
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/30 group-hover:bg-[var(--color-lgr-red)] transition-colors">
                  <Play className="text-white ml-1" size={20} />
                </div>
              )}
              <h3 className="text-xl font-bold text-white uppercase tracking-wide line-clamp-1">{latestMedia?.title || "Galerie"}</h3>
              <p className="text-xs text-gray-300 uppercase tracking-widest mt-1">Najnowsze Media</p>
            </div>
          </motion.div>
        </Link>

        {/* Wide Member Card -> Ostatnie Wydarzenie */}
        <Link href={latestEvent ? `/wydarzenia/${latestEvent.slug}` : "#"} className="col-span-1 md:col-span-3 row-span-1 block h-full">
          <motion.div 
            variants={itemVariants}
            className="w-full h-full bg-[#1A1A1A] rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden group hover:border-[var(--color-lgr-red)]/50 transition-colors"
          >
            {latestEvent?.imageUrls?.[0] && (
              <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700" style={{ backgroundImage: `url(${getMediaUrl(latestEvent.imageUrls[0])})`}}></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            
            <div className="relative z-10 max-w-lg pr-4">
              <span className="inline-block px-3 py-1 bg-white/10 text-white border border-white/10 text-[10px] font-bold mb-4 rounded-full uppercase tracking-wider backdrop-blur-md">Wydarzenie</span>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 line-clamp-2">{latestEvent?.title || "Aktualności"}</h3>
              <p className="text-gray-300 text-sm mb-6 line-clamp-2">Kliknij by przeczytać i zobaczyć więcej z życia klubu LGR.</p>
              <button className="px-6 py-3 bg-[var(--color-lgr-red)] text-white font-bold uppercase tracking-wider text-[10px] rounded hover:bg-red-700 transition-colors">
                Szczegóły
              </button>
            </div>
            
            <div className="relative z-10 mt-6 md:mt-0 flex gap-4 min-w-[150px]">
              <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                <CalendarDays className="text-[var(--color-lgr-red)]" size={24} />
                <div>
                  <span className="block text-xl font-bold text-white leading-none whitespace-nowrap">{latestEvent ? new Date(latestEvent.createdAt).toLocaleDateString("pl-PL", {day: "numeric", month: "long" }) : "-"}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1 block">Opublikowano</span>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
