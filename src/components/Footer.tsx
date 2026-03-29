import Link from "next/link";
import { Facebook, Camera, Youtube, Mail, MapPin, Bike } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-300 border-t border-white/5 pt-16 pb-8 px-4 md:px-12 z-20 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 font-sans">
        
        {/* Kolumna 1 - LGR Info */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-lgr-red)] flex items-center justify-center rounded shadow-lg text-white">
              <Bike size={20} />
            </div>
            <span className="text-xl font-bold uppercase tracking-wider text-white">LGR</span>
          </div>
          <p className="text-sm leading-loose text-gray-400 max-w-sm">
            Limanowska Grupa Rowerowa to coś więcej niż klub. To społeczność zjednoczona przez pasję do dwóch kółek i miłość do naszych gór.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="w-10 h-10 rounded border border-white/10 flex items-center justify-center text-gray-300 hover:border-white hover:text-white transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded border border-white/10 flex items-center justify-center text-gray-300 hover:border-white hover:text-white transition-colors">
              <Camera size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded border border-white/10 flex items-center justify-center text-gray-300 hover:border-white hover:text-white transition-colors">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Kolumna 2 - Nawigacja */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Nawigacja</h3>
          <ul className="flex flex-col gap-4 text-sm font-medium">
            <li><Link href="/o-nas" className="hover:text-white transition-colors">O nas</Link></li>
            <li><Link href="/trasy" className="hover:text-white transition-colors">Trasy</Link></li>
            <li><Link href="/starty" className="hover:text-white transition-colors">Wyniki / Starty</Link></li>
            <li><Link href="/wydarzenia" className="hover:text-white transition-colors">Wydarzenia</Link></li>
            <li><Link href="/sponsorzy" className="hover:text-white transition-colors">Sponsorzy</Link></li>
          </ul>
        </div>

        {/* Kolumna 3 - Kontakt */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Kontakt</h3>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="text-[var(--color-lgr-red)]" size={16} />
              <a href="mailto:kontakt@lgr-team.pl" className="hover:text-white transition-colors">kontakt@lgr-team.pl</a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="text-[var(--color-lgr-red)]" size={16} />
              <span>Limanowa, Małopolska</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Dolny Pasek Prawa Autorskie */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col items-center justify-between gap-6 md:flex-row text-xs font-medium text-gray-500 uppercase tracking-widest">
        <div className="flex flex-col gap-1.5 items-center md:items-start text-center md:text-left">
          <p>&copy; {(new Date()).getFullYear()} LIMANOWSKA GRUPA ROWEROWA. WSZYSTKIE PRAWA ZASTRZEŻONE.</p>
          <p className="text-[10px] text-gray-600 normal-case tracking-wider">
            Realizacja i wdrożenie: <span className="text-gray-400 font-bold">Krzysiek Jędrzejek</span> (<a href="mailto:kjedrzejek86@gmail.com" className="hover:text-white transition-colors">kjedrzejek86@gmail.com</a>)
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link href="/polityka" className="hover:text-white transition-colors">Polityka Prywatności</Link>
          <Link href="/regulamin" className="hover:text-white transition-colors">Regulamin</Link>
        </div>
      </div>
    </footer>
  );
}
