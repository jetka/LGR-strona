import React from "react";
import { Shield } from "lucide-react";

export default function PolitykaPage() {
  return (
    <div className="w-full min-h-screen bg-black text-gray-300 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="mb-12 flex items-center gap-4 border-b border-white/10 pb-8">
          <div className="w-16 h-16 bg-[var(--color-lgr-red)]/20 rounded-2xl flex items-center justify-center border border-[var(--color-lgr-red)]/30">
            <Shield className="text-[var(--color-lgr-red)] w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Polityka Prywatności</h1>
            <p className="text-[10px] text-[var(--color-lgr-red)] font-bold uppercase tracking-[0.3em] mt-2">Limanowska Grupa Rowerowa</p>
          </div>
        </div>

        <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-a:text-[var(--color-lgr-red)] max-w-none">
          <h3>1. Ochrona danych osobowych (RODO)</h3>
          <p>
            Administratorem Twoich danych osobowych jest Limanowska Grupa Rowerowa. Chronimy Twoją prywatność i przetwarzamy absolutne minimum danych wymaganych do technicznego działania serwisu (np. logowanie dla redaktorów strony). Strona nie ma włączonego agresywnego śledzenia (tracking) do celów marketingowych.
          </p>

          <h3>2. Ciasteczka (Cookies)</h3>
          <p>
            Zgodnie z wymogami prawa europejskiego oraz tzw. dyrektywy e-Privacy, informujemy, że strona używa minimalnej ilości ciasteczek do zapamiętywania preferencji (np. zamknięcie paska powiadomień) oraz bezpiecznego uwierzytelniania w panelu administracyjnym. Żadne dane nie są odsprzedawane firmom trzecim.
          </p>

          <h3>3. Zewnętrzne media i mapy</h3>
          <p>
            Artykuły mogą zawierać osadzone mapy tras (np. Leaflet, OpenStreetMap) lub multimedia ładujące się z naszej domeny. W trakcie pobierania tych map łączysz się zewnętrznymi darmowymi bibliotekami (jak np. cartocdn) na zasadach ustalonych przez ich dostawców.
          </p>

          <h3>4. Kontakt do administratora</h3>
          <p>
            Jeśli masz jakiekolwiek pytania dotyczące swoich praw, usunięcia jakichkolwiek treści lub danych z naszej bazy, skontaktuj się z nami poprzez podany u dołu strony e-mail.
          </p>
          
          <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-500 italic">
            Dokument jest aktualnie w fazie prawnego doprecyzowania. Ostatnia aktualizacja: {new Date().getFullYear()} r.
          </div>
        </div>
      </div>
    </div>
  );
}
