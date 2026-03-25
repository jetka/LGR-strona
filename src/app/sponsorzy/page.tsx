"use client";

import { motion } from "framer-motion";
import { Handshake, Heart, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";

const SPONSORS = [
  { 
    name: "Gmina Słopnice", 
    desc: "Partner Strategiczny - wspierający rozwój kolarstwa w regionie Beskidu Wyspowego.",
    image: "http://localhost:8080/sponsorzy/slopnice.png",
    isMain: true
  },
  { 
    name: "Sklep Rowerowy Sportman", 
    desc: "Nasz zaufany partner w zakresie serwisu i sprzętu najwyższej klasy.",
    image: "http://localhost:8080/sponsorzy/sportman.png",
    isMain: true
  },
  { 
    name: "LGR Limanowa", 
    desc: "Inicjatywa zrzeszająca pasjonatów rowerowych z Limanowej i okolic.",
    icon: <Heart className="text-[var(--color-lgr-red)]" size={32} />,
    isMain: false
  },
  { 
    name: "Małopolska", 
    desc: "Region o niesamowitych trasach i możliwościach dla każdego kolarza.",
    icon: <ShieldCheck className="text-[var(--color-lgr-red)]" size={32} />,
    isMain: false
  },
  { 
    name: "Partnerzy Lokalni", 
    desc: "Wszyscy lokalni przedsiębiorcy, którzy wspierają nasze wspólne wyjazdy.",
    icon: <Star className="text-[var(--color-lgr-red)]" size={32} />,
    isMain: false
  }
];

export default function SponsorzyPage() {
  const mainSponsors = SPONSORS.filter(s => s.isMain);
  const secondarySponsors = SPONSORS.filter(s => !s.isMain);

  return (
    <div className="w-full bg-transparent min-h-screen pt-40 pb-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-20">
          <span className="text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-[0.4em] mb-4 block">Nasze Partnerstwa</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
            Partnerzy &<br/>Sponsorzy
          </h1>
          <p className="max-w-2xl text-gray-400 text-lg leading-relaxed">
            Sukcesy Limanowskiej Grupy Rowerowej nie byłyby możliwe bez wsparcia instytucji i firm, 
            które dzielą z nami pasję do sportu i miłość do naszego regionu.
          </p>
        </div>

        {/* Strategic Partners (Big Cards) */}
        <div className="mb-24 flex flex-col gap-10">
          <h2 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Partnerzy Strategiczni</h2>
          {mainSponsors.map((sponsor, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/5 rounded-[40px] p-12 md:p-20 shadow-2xl"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center p-8 shadow-inner group-hover:scale-105 transition-transform duration-700">
                  {sponsor.image ? (
                    <img 
                      src={sponsor.image} 
                      alt={sponsor.name} 
                      className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                  ) : (
                    <div className="text-white text-6xl font-black italic">LGR</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">{sponsor.name}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                    {sponsor.desc}
                  </p>
                </div>
              </div>
              
              {/* Background glows */}
              <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#B4000F]/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-[#B4000F]/5 rounded-full blur-[100px]" />
            </motion.div>
          ))}
        </div>

        {/* Secondary Partners Grid */}
        <div>
          <h2 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-8">Nasi Przyjaciele</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondarySponsors.map((sponsor, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-[#111] border border-white/5 rounded-3xl p-10 flex flex-col gap-6 hover:border-[var(--color-lgr-red)]/30 transition-all duration-500"
              >
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center p-4">
                  {sponsor.image ? (
                    <img src={sponsor.image} alt={sponsor.name} className="w-full h-full object-contain" />
                  ) : (
                    sponsor.icon
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-3">{sponsor.name}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{sponsor.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
