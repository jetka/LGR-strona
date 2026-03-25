"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, Calendar, ArrowUpDown, Film, Image as ImageIcon } from "lucide-react";
import { useState, useMemo } from "react";

const FALLBACK_IMAGES = [
    "http://localhost:8080/articles/2026-03-17-zdjecia/650846985_934486416005084_5088040843992929697_n.jpg",
    "http://localhost:8080/articles/2026-03-17-zdjecia/650916792_934486516005074_8768591359964104230_n.jpg",
    "http://localhost:8080/articles/2026-03-17-zdjecia/651005253_934486732671719_3895271009930800358_n.jpg",
];

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function MediaCard({ post, index, isFeatured }: { post: any; index: number; isFeatured: boolean }) {
    const coverImage = post.imageUrls?.[0] || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    const hasVideo = !!post.videoUrl;

    const containerClasses = isFeatured
        ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2"
        : "col-span-1 row-span-1";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={containerClasses}
        >
            <Link
                href={`/media/${post.slug}`}
                className="relative group overflow-hidden rounded-xl bg-black flex h-full w-full"
            >
                {/* Background — video preview or image */}
                {hasVideo && !post.imageUrls?.length ? (
                    <video
                        src={`${post.videoUrl}#t=1.0`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        muted
                        playsInline
                    />
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${coverImage})` }}
                    />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                {/* Red bottom bar on hover */}
                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[var(--color-lgr-red)] group-hover:w-full transition-all duration-500 ease-out" />

                {/* Content */}
                <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end z-10">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 mb-2">
                        {isFeatured && (
                            <span className="bg-[var(--color-lgr-red)] text-white text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5">
                                Featured
                            </span>
                        )}
                        {hasVideo && (
                            <span className="bg-black/60 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lgr-red)] animate-pulse" />
                                Wideo
                            </span>
                        )}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 mb-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        <Calendar size={10} className="text-[var(--color-lgr-red)]" />
                        {formatDate(post.createdAt)}
                    </div>

                    {/* Title */}
                    <h2
                        className={`font-black uppercase tracking-tighter text-white leading-tight
              group-hover:-translate-y-1 transition-transform duration-500
              ${isFeatured ? "text-2xl md:text-4xl" : "text-lg md:text-xl"}`}
                    >
                        {post.title}
                    </h2>

                    {/* Arrow on hover */}
                    <div className="mt-2 flex items-center gap-2 text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-widest
                          opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-500">
                        Czytaj więcej →
                    </div>
                </div>

                {/* Play button overlay for video */}
                {hasVideo && (
                    <div className={`absolute ${isFeatured ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16" : "top-4 right-4 w-9 h-9"}
                          bg-[var(--color-lgr-red)] rounded-full flex items-center justify-center text-white
                          opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg shadow-red-900/40 z-20`}>
                        <Play size={isFeatured ? 24 : 14} fill="currentColor" className="ml-0.5" />
                    </div>
                )}
            </Link>
        </motion.div>
    );
}

export default function MediaGrid({ posts }: { posts: any[] }) {
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az">("newest");
    const [yearFilter, setYearFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<"all" | "video" | "photo">("all");

    const availableYears = useMemo(() => {
        const years = [...new Set(posts.map(p => new Date(p.createdAt).getFullYear()))];
        return years.sort((a, b) => b - a);
    }, [posts]);

    const filtered = useMemo(() => {
        let result = [...posts];

        // Year filter
        if (yearFilter !== "all") {
            result = result.filter(p => new Date(p.createdAt).getFullYear().toString() === yearFilter);
        }

        // Type filter
        if (typeFilter === "video") result = result.filter(p => !!p.videoUrl);
        if (typeFilter === "photo") result = result.filter(p => !p.videoUrl && p.imageUrls?.length > 0);

        // Sort
        switch (sortBy) {
            case "newest":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "oldest":
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "az":
                result.sort((a, b) => a.title.localeCompare(b.title, "pl"));
                break;
        }

        return result;
    }, [posts, sortBy, yearFilter, typeFilter]);

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-24 min-h-screen text-gray-200">

            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <span className="text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-[0.2em] mb-2 block">
                        Exclusive Gallery
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                        Media
                    </h1>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as any)}
                            className="appearance-none bg-black/50 border border-white/10 rounded-lg
                         px-5 py-3 pr-9 text-sm font-bold uppercase tracking-wider text-white
                         hover:bg-white/5 transition-colors focus:outline-none focus:border-[var(--color-lgr-red)] cursor-pointer"
                        >
                            <option value="newest">Najnowsze</option>
                            <option value="oldest">Najstarsze</option>
                            <option value="az">A → Z</option>
                        </select>
                        <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Year */}
                    <div className="relative">
                        <select
                            value={yearFilter}
                            onChange={e => setYearFilter(e.target.value)}
                            className="appearance-none bg-black/50 border border-white/10 rounded-lg
                         px-5 py-3 pr-9 text-sm font-bold uppercase tracking-wider text-white
                         hover:bg-white/5 transition-colors focus:outline-none focus:border-[var(--color-lgr-red)] cursor-pointer"
                        >
                            <option value="all">Wszystkie lata</option>
                            {availableYears.map(y => <option key={y} value={String(y)}>{y}</option>)}
                        </select>
                        <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Type filter — unique to Media */}
                    <div className="flex gap-2">
                        {[
                            { value: "all", label: "Wszystko" },
                            { value: "video", label: "Wideo", icon: <Film size={13} /> },
                            { value: "photo", label: "Zdjęcia", icon: <ImageIcon size={13} /> },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setTypeFilter(opt.value as any)}
                                className={`flex items-center gap-1.5 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-colors border
                            ${typeFilter === opt.value
                                        ? "bg-[var(--color-lgr-red)] border-[var(--color-lgr-red)] text-white"
                                        : "bg-black/50 border-white/10 text-gray-300 hover:bg-white/5"
                                    }`}
                            >
                                {opt.icon ?? null}
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Result count */}
            <p className="text-gray-500 text-sm mb-8">
                {filtered.length === 0
                    ? "Brak wyników"
                    : `${filtered.length} ${filtered.length === 1 ? "materiał" : filtered.length < 5 ? "materiały" : "materiałów"}`}
            </p>

            {/* ── GRID ── */}
            {filtered.length === 0 ? (
                <p className="text-gray-500 py-16">Brak materiałów spełniających kryteria.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[260px] md:auto-rows-[300px]">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((post, i) => (
                            <MediaCard key={post.id} post={post} index={i} isFeatured={i === 0} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
