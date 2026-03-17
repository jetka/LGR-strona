import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function WydarzeniaPage() {
  const posts = await prisma.post.findMany({
    where: { category: "WYDARZENIA" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-32 min-h-screen text-gray-200">
      <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12">
        Wydarzenia
      </h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-500">Brak postów w tej sekcji.</p>
      ) : (
        <div className="flex flex-col gap-12">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wide text-white mb-6">
                {post.title}
              </h2>
              <div 
                className="text-gray-300 space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
