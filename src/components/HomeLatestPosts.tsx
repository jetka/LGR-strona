"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";

const FALLBACK_IMAGES = [
    "http://localhost:8080/articles/2026-03-17-zdjecia/650846985_934486416005084_5088040843992929697_n.jpg",
    "http://localhost:8080/articles/2026-03-17-zdjecia/650916792_934486516005074_8768591359964104230_n.jpg",
    "http://localhost:8080/articles/2026-03-17-zdjecia/651005253_934486732671719_3895271009930800358_n.jpg",
];

const CATEGORY_PATHS: Record<string, string> = {
    STARTY: "starty",
    WYDARZENIA: "wydarzenia",
    INNE: "trasy",
    MEDIA: "media",
};

const CATEGORY_LABELS: Record<string, string> = {
    STARTY: "Starty",
    WYDARZENIA: "Wydarzenie",
    INNE: "Trasa",
    MEDIA: "Media",
};

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function HomeLatestPosts({ posts }: { posts: any[] }) {
    if (posts.length === 0) return null;

    return (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16">
            {/* Section header */}
            <div className="flex items-end justify-between mb-10">
                <div>
                    <span className="text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-[0.2em] block mb-2">
                        Aktualności
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                        Ostatnie artykuły
                    </h2>
                </div>
                <Link
                    href="/starty"
                    className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors group"
                >
                    Wszystkie
                    <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                        →
                    </motion.span>
                </Link>
            </div>

            {/* Cards grid — same PostCard style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((post, i) => {
                    const img = post.imageUrls?.[0] || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                    const basePath = CATEGORY_PATHS[post.category] || "starty";
                    const label = CATEGORY_LABELS[post.category] || post.category;

                    return (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                        >
                            <Link
                                href={`/${basePath}/${post.slug}`}
                                className="group relative flex flex-col overflow-hidden rounded-xl bg-black border border-white/5 h-[320px]"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                                    style={{ backgroundImage: `url(${img})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 group-hover:via-black/70 transition-all duration-500" />
                                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[var(--color-lgr-red)] group-hover:w-full transition-all duration-500 ease-out" />

                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-[var(--color-lgr-red)] text-white text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1">
                                        {label}
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-2 mb-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                        <Calendar size={11} className="text-[var(--color-lgr-red)]" />
                                        {formatDate(post.createdAt)}
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight mb-2 group-hover:-translate-y-1 transition-transform duration-500">
                                        {post.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-500">
                                        Czytaj więcej →
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
