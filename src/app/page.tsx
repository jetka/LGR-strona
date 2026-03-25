import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import ResultsTable from "@/components/ResultsTable";
import HomeLatestPosts from "@/components/HomeLatestPosts";
import PartnersTicker from "@/components/PartnersTicker";

export const revalidate = 0;

export default async function Home() {
  // Fetch latest posts from all editorial sections
  const latestPosts = await prisma.post.findMany({
    where: { category: { in: ["STARTY", "WYDARZENIA", "INNE"] } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  // Fetch the latest route that has GPX data
  const latestRouteRaw = await prisma.post.findFirst({
    where: { 
      category: "INNE",
      gpxUrl: { not: null },
      routeData: { not: null }
    },
    orderBy: { createdAt: "desc" }
  });
  
  // Need to parse JsonValue nicely or just pass as any
  const latestRoute = latestRouteRaw as any;

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="-mt-24">
        <HeroSection />
      </div>

      <main className="w-full relative z-20">
        <BentoGrid latestRoute={latestRoute} />

        {/* Latest articles section */}
        <HomeLatestPosts posts={latestPosts} />

        <PartnersTicker />

        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 pb-32">
          <ResultsTable />
        </section>
      </main>
    </div>
  );
}
