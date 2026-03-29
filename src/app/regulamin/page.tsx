import React from "react";
import { Scale } from "lucide-react";

export default function RegulaminPage() {
  return (
    <div className="w-full min-h-screen bg-black text-gray-300 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="mb-12 flex items-center gap-4 border-b border-white/10 pb-8">
          <div className="w-16 h-16 bg-[var(--color-lgr-red)]/20 rounded-2xl flex items-center justify-center border border-[var(--color-lgr-red)]/30">
            <Scale className="text-[var(--color-lgr-red)] w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Regulamin Strony</h1>
            <p className="text-[10px] text-[var(--color-lgr-red)] font-bold uppercase tracking-[0.3em] mt-2">Limanowska Grupa Rowerowa</p>
          </div>
        </div>

        <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-a:text-[var(--color-lgr-red)] max-w-none">
          <h3>1. Postanowienia organizacyjne</h3>
          <p>
            Niniejsza strona stanowi wizytówkę organizacji sportowej i służy jako cyfrowe centrum informacyjne. Serwis udostępnia trasy, pliki GPX oraz najświeższe informacje od grupy kolarskiej w Limanowej.
          </p>

          <h3>2. Własność i odpowiedzialność</h3>
          <p>
            Wszelkie teksty, materiały wizualne (filmy, zdjęcia), oraz publikacje są własnością twórców przypisanych na stronie. Surowo zabrania się kopiowania, pobierania czy wykorzystywania powyższych materiałów bez uprzedniej pisemnej aprobaty administracji.
          </p>

          <h3>3. Pliki Map i Trasy (GPX)</h3>
          <p>
            Trasy rowerowe (GPX) wgrywane do serwisu prezentują trasy udostępniane dla naszej wspólnoty i fanów z zewnątrz.
            Limanowska Grupa Rowerowa dołożyła najwyższych starań w zaplanowaniu i opisaniu tych tras, aczkolwiek warunki drogowe zależą od czynników niezależnych (np. pogodowych czy leśnych robót i zniszczeń dróg w powiecie).
            Jeździsz nimi wyłącznie na swoją własną odpowiedzialność. Nie jesteśmy ubezpieczycielem dla Twoich prywatnych przejazdów po wyznaczonych ścieżkach kolarskich. Zawsze używaj osądów na własne ryzyko.
          </p>

        </div>
      </div>
    </div>
  );
}
