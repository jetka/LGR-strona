import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function StartyPage() {
  const posts = await prisma.post.findMany({
    where: { category: "STARTY" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-32 min-h-screen text-gray-200">
      <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12">
        Starty
      </h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-500">Brak postów w tej sekcji.</p>
      ) : (
        <div className="flex flex-col gap-12">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8">
              <h2 className="text-3xl font-bold uppercase tracking-wide text-[var(--color-lgr-red)] mb-6">
                {post.title}
              </h2>
              <div 
                className="text-gray-300 space-y-4 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
