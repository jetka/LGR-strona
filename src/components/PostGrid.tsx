"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { Calendar, ChevronDown, ArrowUpDown, SlidersHorizontal, Clock, Film, Image as ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";

const GPXMap = dynamic(() => import("./GPXMap"), { ssr: false });

// Fallback images from local media server
const FALLBACK_IMAGES = [
    "http://localhost:8080/articles/2026-03-17-zdjecia/650846985_934486416005084_5088040843992929697_n.jpg",
    "http://localhost:8080/articles/2026-03-17-zdjecia/650916792_934486516005074_8768591359964104230_n.jpg",
    "http://localhost:8080/articles/2026-03-17-zdjecia/651005253_934486732671719_3895271009930800358_n.jpg",
];

function formatDate(date: Date, isMounted: boolean) {
    if (!isMounted) return "";
    return new Date(date).toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function PostCard({ post, index, basePath, isMounted }: { post: any; index: number; basePath: string; isMounted: boolean }) {
    const hasGpx = post.category === "INNE" && post.routeData && post.routeData.length > 0;
    const img = !hasGpx ? (post.imageUrls?.[0] || (post.category === "INNE" ? "/trasyBG.jpg" : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length])) : null;

    if (!isMounted) {
        return <div className="group relative flex flex-col overflow-hidden rounded-xl bg-black border border-white/5 h-[340px] md:h-[380px]" />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
        >
            <Link
                href={`/${basePath}/${post.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl bg-black border border-white/5 h-[340px] md:h-[380px]"
            >
                {/* Background rendering */}
                {hasGpx ? (
                    <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none">
                        <GPXMap route={post} disableLink={true} />
                    </div>
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                        style={{ backgroundImage: `url(${img})` }}
                    />
                )}

                {/* Darkening overlay — lifts on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 group-hover:via-black/70 transition-all duration-500" />

                {/* Animated red accent bar — slides in from left on hover */}
                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[var(--color-lgr-red)] group-hover:w-full transition-all duration-500 ease-out" />

                {/* Category badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[var(--color-lgr-red)] text-white text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1">
                        {post.category}
                    </span>
                </div>

                {/* Video badge */}
                {post.videoUrl && (
                    <div className="absolute top-4 right-4 z-10 bg-black/60 border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5 text-white text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-lgr-red)] animate-pulse" />
                        Wideo
                    </div>
                )}

                {/* Content — slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-3 text-gray-400 text-[10px] font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                        <Calendar size={11} className="text-[var(--color-lgr-red)]" />
                        {formatDate(post.createdAt, isMounted)}
                    </div>

                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-3 group-hover:-translate-y-1 transition-transform duration-500">
                        {post.title}
                    </h2>

                    {/* Excerpt — hidden normally, visible on hover */}
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 transition-all duration-500 overflow-hidden"
                        dangerouslySetInnerHTML={{
                            __html: post.content.replace(/<[^>]+>/g, "").substring(0, 110) + "…"
                        }}
                    />

                    {/* Read more arrow */}
                    <div className="flex items-center gap-2 mt-3 text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-500 delay-75">
                        Czytaj więcej
                        <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                        >
                            →
                        </motion.span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

interface Props {
    posts: any[];
    sectionTitle: string;
    sectionSubtitle: string;
    basePath: string; // "starty" | "wydarzenia" | "trasy"
    emptyMessage?: string;
}

export default function PostGrid({ posts, sectionTitle, sectionSubtitle, basePath, emptyMessage }: Props) {
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az">("newest");
    const [yearFilter, setYearFilter] = useState<string>("all");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Available years from actual data
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
    }, [posts, sortBy, yearFilter]);

    return (
        <div className="w-full min-h-screen text-gray-200 pt-24 pb-32">

            {/* ── HEADER ── */}
            <div className="max-w-[1300px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-white/5 gap-4">
                    <div className="text-center md:text-left">
                        <span className="text-[var(--color-lgr-red)] text-[10px] font-black uppercase tracking-[0.4em] block mb-1 opacity-50">
                            {sectionSubtitle}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            {sectionTitle} <span className="text-[var(--color-lgr-red)]">LGR</span>
                        </h1>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
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
                            : `${filtered.length} ${filtered.length === 1 ? "artykuł" : filtered.length < 4 ? "artykuły" : "artykułów"}`}
                    </p>
                </div>
            </div>

            {/* ── GRID ── */}
            <div className="max-w-[1300px] mx-auto px-4 md:px-8">
                {filtered.length === 0 ? (
                    <p className="text-gray-500 py-16">{emptyMessage || "Brak artykułów spełniających kryteria."}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((post, i) => (
                                <PostCard key={post.id} post={post} index={i} basePath={basePath} isMounted={isMounted} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
