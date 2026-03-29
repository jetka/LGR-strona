"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { useState } from "react";
import { getMediaUrl } from "@/lib/media";

// The 3 images from lgr-media-server served via 192.168.1.32:8080
const GALLERY_IMAGES = [
    "http://192.168.1.32:8080/articles/2026-03-17-zdjecia/650846985_934486416005084_5088040843992929697_n.jpg",
    "http://192.168.1.32:8080/articles/2026-03-17-zdjecia/650916792_934486516005074_8768591359964104230_n.jpg",
    "http://192.168.1.32:8080/articles/2026-03-17-zdjecia/651005253_934486732671719_3895271009930800358_n.jpg",
];

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function ArticleCard({ post, index }: { post: any; index: number }) {
    const [expanded, setExpanded] = useState(false);
    // Cycle through the available images
    const heroImg = post.imageUrls?.[0] || GALLERY_IMAGES[index % GALLERY_IMAGES.length];
    const inlineImg = post.imageUrls?.[1] || GALLERY_IMAGES[(index + 1) % GALLERY_IMAGES.length];

    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="w-full"
        >
            {/* ── HERO IMAGE ── */}
            <div className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden mb-8 md:mb-12">
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url(${getMediaUrl(heroImg)})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

                {/* Badge + Title overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                    <span className="bg-[var(--color-lgr-red)] text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 mb-4 inline-block">
                        Artykuł
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                        {post.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-5 text-gray-300 text-xs font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2 text-[var(--color-lgr-red)]">
                            <Calendar size={14} /> {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center gap-2">
                            <MapPin size={14} className="text-[var(--color-lgr-red)]" /> Limanowa, Polska
                        </span>
                    </div>
                </div>
            </div>

            {/* ── BODY ── */}
            <div className="max-w-[1100px] mx-auto px-4 md:px-8">

                {/* — Two-column layout: sidebar title + content — */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 mb-14">
                    {/* Left: sidebar title with red bar */}
                    <div className="md:col-span-4">
                        <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter mb-3 leading-tight">
                            Pasja i&nbsp;determinacja&nbsp;na każdym metrze
                        </h3>
                        <div className="w-10 h-[2px] bg-[var(--color-lgr-red)]" />
                    </div>

                    {/* Right: article text from editor */}
                    <div className="md:col-span-8 text-gray-300 text-base md:text-lg leading-relaxed space-y-5">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>

                {/* — Inline images (if more than 1 attached) — */}
                {post.imageUrls?.length > 1 && (
                    <div className="mb-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {post.imageUrls.slice(1).map((src: string, i: number) => (
                            <div key={i}>
                                <img
                                    src={getMediaUrl(src)}
                                    alt={`Zdjęcie ${i + 2}`}
                                    className="w-full max-h-[420px] object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* — Author badge — */}
                <div className="flex items-center gap-4 pb-20 border-b border-white/5">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-lgr-red)]/20 border border-[var(--color-lgr-red)]/30 flex items-center justify-center text-[var(--color-lgr-red)] font-black text-xs">
                        LGR
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Artykuł</p>
                        <p className="text-white text-sm font-bold tracking-wide">Redakcja LGR Limanowa</p>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

interface Props {
    posts: any[];
    sectionTitle: string;
    sectionSubtitle: string;
    emptyMessage?: string;
}

export default function ArticleList({ posts, sectionTitle, sectionSubtitle, emptyMessage = "Brak postów w tej sekcji." }: Props) {
    return (
        <div className="w-full min-h-screen text-gray-200 pt-24">

            {/* Section header */}
            <div className="max-w-[1100px] mx-auto px-4 md:px-8 mb-14">
                <span className="text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-[0.2em] block mb-2">
                    {sectionSubtitle}
                </span>
                <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                    {sectionTitle}
                </h1>
            </div>

            {posts.length === 0 ? (
                <div className="max-w-[1100px] mx-auto px-4 md:px-8 pb-32">
                    <p className="text-gray-500">{emptyMessage}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-24">
                    {posts.map((post, i) => (
                        <ArticleCard key={post.id} post={post} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}
