"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ONasPage() {
  return (
    <div className="w-full bg-transparent min-h-screen text-gray-200 pb-24 relative z-10">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 md:pt-20">
        
        {/* Main Image Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[300px] md:h-[500px] overflow-hidden"
        >
          <img 
            src="/about.jpg" 
            alt="LGR Team" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Red Box overlay */}
          <div className="absolute bottom-0 right-0 bg-[var(--color-lgr-red)] px-8 py-6 w-[200px] flex flex-col items-center justify-center transform translate-y-2 translate-x-1">
            <div className="text-3xl font-black text-white text-center leading-none mb-1">10 LAT</div>
            <div className="text-[10px] uppercase tracking-widest text-white/90 font-medium text-center">Wspólnych wyjazdów</div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="bg-black/40 backdrop-blur-md border border-white/5 px-6 py-16 md:px-16 md:py-24 flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-[2px] bg-[var(--color-lgr-red)]"></div>
            <span className="text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-[0.2em]">Nasza historia</span>
            <div className="w-12 h-[2px] bg-[var(--color-lgr-red)]"></div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-10"
          >
            O nas
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-[22px] font-medium text-gray-200 max-w-3xl mb-8 leading-relaxed"
          >
            Limanowska Grupa Rowerowa to coś więcej niż klub. To społeczność zjednoczona przez pasję do dwóch kółek i miłość do naszych gór.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm md:text-[15px] text-gray-400 max-w-[800px] mb-12 leading-loose"
          >
            Od ponad dekady przecieramy szlaki Beskidu Wyspowego, promując aktywny tryb życia i kolarstwo w każdej jego formie. Od amatorskich przejażdżek po profesjonalne starty w maratonach MTB – w LGR każdy znajdzie swoje miejsce. Nasza ekipa to ponad 50 pasjonatów, dla których rower to sposób na życie.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <Link href="/team" className="flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-lgr-red)] hover:bg-red-700 text-white font-bold uppercase tracking-widest text-sm transition-colors group">
              Poznaj team <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/media" className="flex items-center justify-center px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white font-bold uppercase tracking-widest text-sm transition-colors">
              Galeria
            </Link>
          </motion.div>

          {/* Divider */}
          <div className="w-full max-w-2xl h-[1px] bg-white/10 mb-16"></div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-12 w-full max-w-xl"
          >
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter">150+</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Aktywnych Członków</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter">12k</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">KM Rocznie</span>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
