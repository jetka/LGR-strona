"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "O Nas", href: "/o-nas" },
  { name: "Trasy", href: "/trasy" },
  { name: "Media", href: "/media" },
  { name: "Starty", href: "/starty" },
  { name: "Wydarzenia", href: "/wydarzenia" },
  { name: "Sponsorzy", href: "/sponsorzy" },
  { name: "Dokumenty", href: "/dokumenty" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // Animacje tła podczas scrollowania - teraz znacznie wydłużone (z 50 na 300px)
  const backgroundColor = useTransform(
    scrollY,
    [0, 300],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.9)"]
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, 300],
    ["blur(0px)", "blur(16px)"]
  );
  const borderOpacity = useTransform(
    scrollY,
    [0, 300],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.15)"]
  );

  // Zamknij menu mobilne przy zmianie trasy
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{ 
          backgroundColor,
          backdropFilter: backdropBlur,
          borderBottom: `1px solid`,
          borderColor: borderOpacity
        }}
        className="fixed top-0 left-0 w-full z-[100] py-4 px-6 md:px-12 transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="relative z-[110] flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image 
                src="/logo_red.png" 
                alt="LGR Logo" 
                width={120} 
                height={40} 
                className="object-contain h-8 w-auto md:h-12 drop-shadow-[0_0_10px_rgba(180,0,15,0.3)]"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group text-[11px] lg:text-xs font-black uppercase tracking-[0.2em] text-gray-300 hover:text-white transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  {link.name}
                  {/* Animated underline */}
                  <motion.div
                    initial={false}
                    animate={{ width: isActive ? "100%" : "0%" }}
                    className="absolute -bottom-1 left-0 h-[2px] bg-[var(--color-lgr-red)] group-hover:w-full transition-all duration-300"
                  />
                </Link>
              );
            })}

            <Link
              href="/kontakt"
              className={`relative group text-[11px] lg:text-xs font-black uppercase tracking-[0.2em] text-gray-300 hover:text-white transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
            >
              Kontakt
              {/* Animated underline for Kontakt as well */}
              <motion.div
                initial={false}
                animate={{ width: pathname === '/kontakt' ? "100%" : "0%" }}
                className="absolute -bottom-1 left-0 h-[2px] bg-[var(--color-lgr-red)] group-hover:w-full transition-all duration-300"
              />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 relative z-[110]">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2 hover:text-[var(--color-lgr-red)] transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] bg-[#0a0a0a] md:hidden flex flex-col justify-center px-10 gap-8"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link 
                    href={link.href}
                    className="flex justify-between items-center text-4xl font-black text-white uppercase tracking-tighter hover:text-[var(--color-lgr-red)] transition-colors group"
                  >
                    {link.name}
                    <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" size={32} />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.1 }}
                className="pt-8 border-t border-white/10"
              >
                <Link 
                  href="/kontakt"
                  className="text-4xl font-black text-[var(--color-lgr-red)] uppercase tracking-tighter"
                >
                  Kontakt
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
