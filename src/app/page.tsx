import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/HeroSection";
import BentoGrid from "@/components/BentoGrid";
import ResultsTable from "@/components/ResultsTable";
import HomeLatestPosts from "@/components/HomeLatestPosts";
import PartnersTicker from "@/components/PartnersTicker";

// ISR: regenerate every 60 seconds instead of on every request
export const revalidate = 60;

// Select only the fields we actually need for the homepage cards
const cardSelect = {
  id: true,
  slug: true,
  title: true,
  category: true,
  imageUrls: true,
  videoUrl: true,
  createdAt: true,
  content: true,
} as const;

export default async function Home() {
  // Run ALL queries in parallel instead of sequentially
  const [latestPosts, latestRouteRaw, latestStartRaw, latestMediaRaw, latestEventRaw] = await Promise.all([
    prisma.post.findMany({
      where: { category: { in: ["STARTY", "WYDARZENIA", "INNE"] } },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: cardSelect,
    }),
    prisma.post.findFirst({
      where: { gpxUrl: { not: null }, routeData: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { ...cardSelect, routeData: true, gpxUrl: true, distance: true, elevation: true },
    }),
    prisma.post.findFirst({
      where: { category: "STARTY" },
      orderBy: { createdAt: "desc" },
      select: cardSelect,
    }),
    prisma.post.findFirst({
      where: { category: "MEDIA" },
      orderBy: { createdAt: "desc" },
      select: cardSelect,
    }),
    prisma.post.findFirst({
      where: { category: "WYDARZENIA" },
      orderBy: { createdAt: "desc" },
      select: cardSelect,
    }),
  ]);

  const latestRoute = latestRouteRaw as any;
  const latestStart = latestStartRaw as any;
  const latestMedia = latestMediaRaw as any;
  const latestEvent = latestEventRaw as any;

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="-mt-24">
        <HeroSection />
      </div>

      <div className="w-full relative z-20">
        <BentoGrid 
          latestRoute={latestRoute} 
          latestStart={latestStart}
          latestMedia={latestMedia}
          latestEvent={latestEvent}
        />

        {/* Latest articles section */}
        <HomeLatestPosts posts={latestPosts} />

        <PartnersTicker />

        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 pb-32">
          <ResultsTable />
        </section>
      </div>
    </div>
  );
}

