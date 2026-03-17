import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Play } from "lucide-react";

export const revalidate = 60; // Regenerate page every 60 seconds

export default async function MediaPage() {
  const posts = await prisma.post.findMany({
    where: { category: "MEDIA" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-32 min-h-screen text-gray-200">
      <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12">
        Media & Filmy
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">Brak materiałów wideo w tej sekcji.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 overflow-hidden flex flex-col group">
              {post.videoUrl && (
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative mb-6">
                   <video 
                    src={post.videoUrl} 
                    controls 
                    className="w-full h-full object-contain"
                    poster={post.imageUrls[0] || ""}
                  />
                </div>
              )}
              <h2 className="text-2xl font-bold uppercase tracking-wide text-white mb-3">{post.title}</h2>
              <div className="text-gray-400 text-sm mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
