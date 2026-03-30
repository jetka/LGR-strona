import { FileText } from "lucide-react";

export default function DokumentyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-32 min-h-screen text-gray-200">
      <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12">
        Dokumenty
      </h1>
      
      <div className="flex flex-col gap-4">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex items-center gap-4 hover:bg-[#222] transition-colors cursor-pointer">
          <FileText className="text-[var(--color-lgr-red)]" size={32} />
          <span className="text-lg font-bold text-white tracking-widest uppercase">Doc1</span>
        </div>
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex items-center gap-4 hover:bg-[#222] transition-colors cursor-pointer">
          <FileText className="text-[var(--color-lgr-red)]" size={32} />
          <span className="text-lg font-bold text-white tracking-widest uppercase">Doc2</span>
        </div>
      </div>
    </div>
  );
}
