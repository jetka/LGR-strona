"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, Calendar, ArrowUpDown, Film, Image as ImageIcon } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { getMediaUrl } from "@/lib/media";

const FALLBACK_IMAGES = [
    "/articles/2026-03-17-zdjecia/650846985_934486416005084_5088040843992929697_n.jpg",
    "/articles/2026-03-17-zdjecia/650916792_934486516005074_8768591359964104230_n.jpg",
    "/articles/2026-03-17-zdjecia/651005253_934486732671719_3895271009930800358_n.jpg",
];

function formatDate(date: Date, isMounted: boolean) {
    if (!isMounted) return "";
    return new Date(date).toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function MediaCard({ post, index, isFeatured, isMounted }: { post: any; index: number; isFeatured: boolean; isMounted: boolean }) {
    const rawImage = post.imageUrls?.[0] || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    const coverImage = getMediaUrl(rawImage);
    const hasVideo = !!post.videoUrl;

    const containerClasses = isFeatured
        ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2"
        : "col-span-1 row-span-1";

    if (!isMounted) return <div className={containerClasses} />;

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

                    <div className="flex items-center gap-1.5 mb-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        <Calendar size={10} className="text-[var(--color-lgr-red)]" />
                        {formatDate(post.createdAt, isMounted)}
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
    const [showVideo, setShowVideo] = useState(true);
    const [showPhoto, setShowPhoto] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleType = (type: "video" | "photo") => {
        if (type === "video") {
            const next = !showVideo;
            if (!next && !showPhoto) {
                setShowVideo(true);
                setShowPhoto(true);
            } else {
                setShowVideo(next);
            }
        } else {
            const next = !showPhoto;
            if (!next && !showVideo) {
                setShowVideo(true);
                setShowPhoto(true);
            } else {
                setShowPhoto(next);
            }
        }
    };

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
        if (showVideo && !showPhoto) {
            result = result.filter(p => !!p.videoUrl);
        } else if (!showVideo && showPhoto) {
            result = result.filter(p => !p.videoUrl);
        }
        // If both true or both false (due to logic handled in toggle) - show all filtered by year/sort only

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
    }, [posts, sortBy, yearFilter, showVideo, showPhoto]);

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-24 min-h-screen text-gray-200">

            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-white/5 gap-4">
                <div className="text-center md:text-left">
                    <span className="text-[var(--color-lgr-red)] text-[10px] font-black uppercase tracking-[0.4em] block mb-1 opacity-50">
                        Galeria Multimedialna
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                        Media <span className="text-[var(--color-lgr-red)]">LGR</span>
                    </h1>
                </div>

                {/* Controls - right top */}
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 md:gap-4">
                    {/* Media Switches */}
                    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 p-1 rounded-xl">
                        <button
                            onClick={() => toggleType("video")}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all h-8 whitespace-nowrap
                                ${showVideo 
                                    ? "bg-[var(--color-lgr-red)] text-white shadow-lg shadow-red-900/20" 
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                        >
                            <Film size={12} /> Video
                        </button>
                        <button
                            onClick={() => toggleType("photo")}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all h-8 whitespace-nowrap
                                ${showPhoto 
                                    ? "bg-[var(--color-lgr-red)] text-white shadow-lg shadow-red-900/20" 
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                        >
                            <ImageIcon size={12} /> Zdjęcia
                        </button>
                    </div>

                    <div className="w-px h-6 bg-white/10 hidden md:block" />

                    <div className="relative group">
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as any)}
                            className="appearance-none bg-[#141414] border border-white/10 rounded-xl px-4 pr-10 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:border-white/20 transition-all focus:outline-none focus:border-[var(--color-lgr-red)] cursor-pointer h-10 min-w-[130px]"
                        >
                            <option value="newest" className="bg-[#141414] text-white">Najnowsze</option>
                            <option value="oldest" className="bg-[#141414] text-white">Najstarsze</option>
                            <option value="az" className="bg-[#141414] text-white">A → Z</option>
                        </select>
                        <ArrowUpDown size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-[var(--color-lgr-red)] transition-colors" />
                    </div>

                    <div className="relative group">
                        <select
                            value={yearFilter}
                            onChange={e => setYearFilter(e.target.value)}
                            className="appearance-none bg-[#141414] border border-white/10 rounded-xl px-4 pr-10 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:border-white/20 transition-all focus:outline-none focus:border-[var(--color-lgr-red)] cursor-pointer h-10 min-w-[130px]"
                        >
                            <option value="all" className="bg-[#141414] text-white">Wszystkie lata</option>
                            {availableYears.map(y => (
                                <option key={y} value={String(y)} className="bg-[#141414] text-white">{y}</option>
                            ))}
                        </select>
                        <Calendar size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-[var(--color-lgr-red)] transition-colors" />
                    </div>
                </div>
            </div>

            {/* Result count */}
            <div className="flex justify-between items-center mb-10">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    {filtered.length === 0
                        ? "Brak wyników"
                        : `${filtered.length} ${filtered.length === 1 ? "materiał" : filtered.length < 5 ? "materiały" : "materiałów"}`}
                </p>
            </div>

            {/* ── CONTENT GRID ── */}
            {filtered.length === 0 ? (
                <p className="text-gray-500 py-16">Brak materiałów spełniających kryteria.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[260px] md:auto-rows-[300px]">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((post, i) => (
                            <MediaCard key={post.id} post={post} index={i} isFeatured={(!showVideo || !showPhoto) && i === 0} isMounted={isMounted} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
