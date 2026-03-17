"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Building, CreditCard } from "lucide-react";

export default function KontaktPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 min-h-screen">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-12">
          Kontakt
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dane kontaktowe */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-white mb-4">
              Klub Sportowy Limanowska Grupa Rowerowa
            </h2>
            
            <div className="flex items-center gap-4 text-gray-300">
              <MapPin className="text-[var(--color-lgr-red)]" size={24} />
              <span>34-615 Słopnice 861</span>
            </div>
            
            <div className="flex items-center gap-4 text-gray-300">
              <Phone className="text-[var(--color-lgr-red)]" size={24} />
              <span>tel. 503 569 000</span>
            </div>

            <div className="flex items-center gap-4 text-gray-300">
              {/* Prosta ikona facebook */}
              <div className="bg-[var(--color-lgr-red)] w-6 h-6 rounded flex items-center justify-center font-bold text-white text-xs">
                f
              </div>
              <a href="#" className="hover:text-white transition-colors">facebook</a>
            </div>

            <div className="flex items-center gap-4 text-gray-300">
              <Mail className="text-[var(--color-lgr-red)]" size={24} />
              <span>e-mail: lgr.limanowa@gmail.com</span>
            </div>

            <hr className="border-white/10 my-2" />

            <div className="flex items-start gap-4 text-gray-300">
              <CreditCard className="text-[var(--color-lgr-red)] shrink-0" size={24} />
              <div>
                <span className="block text-sm text-gray-400 mb-1 uppercase tracking-wider">Nr rachunku bankowego (mBank)</span>
                <span className="font-mono text-white text-lg">23 1140 2004 000 3202 82100 7182</span>
              </div>
            </div>
          </div>

          {/* Zarząd Klubu */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Building className="text-[var(--color-lgr-red)]" size={28} />
              <h2 className="text-2xl font-bold uppercase tracking-wider text-white">
                Zarząd Klubu
              </h2>
            </div>
            
            <ul className="flex flex-col gap-6">
              <li className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xl text-white font-medium">Emanuel Piaskowy</span>
                <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-lgr-red)]">Prezes Zarządu</span>
              </li>
              <li className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xl text-white font-medium">Tomasz Maciuszek</span>
                <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Wiceprezes</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-xl text-white font-medium">Maciej Etgens</span>
                <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Skarbnik</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
