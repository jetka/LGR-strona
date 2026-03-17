"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-12 backdrop-blur-md bg-black/30 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo_red.png" 
            alt="LGR Logo" 
            width={120} 
            height={40} 
            className="object-contain h-8 w-auto md:h-10"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[12px] lg:text-sm font-medium uppercase tracking-wider text-gray-200">
          <Link href="/o-nas" className="hover:text-white transition-colors duration-200">O Nas</Link>
          <Link href="/trasy" className="hover:text-white transition-colors duration-200">Trasy</Link>
          <Link href="/media" className="hover:text-white transition-colors duration-200">Media</Link>
          <Link href="/starty" className="hover:text-white transition-colors duration-200">Starty</Link>
          <Link href="/wydarzenia" className="hover:text-white transition-colors duration-200">Wydarzenia</Link>
          <Link href="/sponsorzy" className="hover:text-white transition-colors duration-200">Sponsorzy</Link>
          <Link href="/dokumenty" className="hover:text-white transition-colors duration-200">Dokumenty</Link>
          <Link href="/kontakt" className="hover:text-[var(--color-lgr-red)] transition-colors duration-200 font-bold">Kontakt</Link>
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link href="/dolacz" className="hidden md:block px-6 py-2 bg-[var(--color-lgr-red)] hover:bg-red-700 text-white font-bold uppercase tracking-wide text-sm rounded transition-colors duration-300">
            Dołącz do nas
          </Link>
          <button className="md:hidden text-white p-2">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
