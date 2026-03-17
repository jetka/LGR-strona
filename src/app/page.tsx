import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import ResultsTable from "@/components/ResultsTable";

export default function Home() {
  return (
    <div className="w-full bg-black min-h-screen">
      {/* Remove default padding since Hero takes full height */}
      <div className="-mt-24">
        <HeroSection />
      </div>

      <main className="w-full relative z-20">
        <BentoGrid />
        
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 pb-32">
          <ResultsTable />
        </section>
      </main>
    </div>
  );
}
