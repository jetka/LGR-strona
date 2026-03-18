"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function MediaGrid({ posts }: { posts: any[] }) {
    const [filter, setFilter] = useState("DATE");

    // Format daty YYYY-MM-DD
    const formatDate = (date: Date) => {
        return new Date(date).toISOString().split('T')[0];
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-24 min-h-screen text-gray-200">

            {/* Header section as in Screenshot */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                <div>
                    <span className="text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-[0.2em] mb-2 block">Exclusive Gallery</span>
                    <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                        Media
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-black/40 border border-white/10 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-white hover:bg-white/5 transition-colors">
                        Date <ChevronDown size={16} />
                    </button>
                    <button className="flex items-center gap-2 bg-black/40 border border-white/10 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-white hover:bg-white/5 transition-colors">
                        Location <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {posts.length === 0 ? (
                <p className="text-gray-500">Brak materiałów wideo w tej sekcji.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
                    {posts.map((post, i) => {
                        // First item gets a large featured spanning
                        const isFeatured = i === 0;
                        const containerClasses = isFeatured
                            ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2"
                            : "col-span-1 row-span-1";

                        const coverImage = post.imageUrls?.[0] || "https://images.unsplash.com/photo-1541625602330-2277a4c4618c?q=80&w=2070&auto=format&fit=crop";

                        return (
                            <Link
                                href={`/media/${post.slug}`}
                                key={post.id}
                                className={`relative group overflow-hidden rounded-xl bg-black ${containerClasses}`}
                            >
                                {/* Background Image / Video Poster */}
                                {post.videoUrl && !post.imageUrls?.length ? (
                                    <video
                                        src={`${post.videoUrl}#t=1.0`}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : (
                                    <motion.div
                                        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                                        style={{ backgroundImage: `url(${coverImage})` }}
                                    />
                                )}

                                {/* Gradient Overlay bottom to top */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                    {/* For Featured, add red badge */}
                                    {(isFeatured) && (
                                        <div className="mb-3">
                                            <span className="bg-[var(--color-lgr-red)] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm">Featured</span>
                                            <span className="text-gray-300 text-xs font-medium ml-3">{formatDate(post.createdAt)}</span>
                                        </div>
                                    )}

                                    {!isFeatured && (
                                        <div className="mb-2 text-gray-300 text-[10px] uppercase font-bold tracking-widest">
                                            {formatDate(post.createdAt)}
                                        </div>
                                    )}

                                    <h2 className={`${isFeatured ? 'text-3xl md:text-5xl' : 'text-xl'} font-black uppercase tracking-tighter text-white leading-tight mb-2 group-hover:-translate-y-2 transition-transform duration-500`}>
                                        {post.title}
                                    </h2>

                                    {isFeatured && (
                                        <div className="flex items-center gap-2 text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 delay-100">
                                            <MapPin size={16} className="text-[var(--color-lgr-red)]" /> Polska
                                        </div>
                                    )}

                                    {/* Play icon overlay if video exists */}
                                    {post.videoUrl && !isFeatured && (
                                        <div className="absolute top-4 right-4 bg-[var(--color-lgr-red)] w-8 h-8 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-110 transition-transform">
                                            <Play size={14} fill="currentColor" className="ml-0.5" />
                                        </div>
                                    )}
                                    {post.videoUrl && isFeatured && (
                                        <div className="absolute top-6 right-6 lg:top-1/2 lg:right-1/2 lg:translate-x-1/2 lg:-translate-y-1/2 w-16 h-16 bg-[var(--color-lgr-red)] rounded-full flex items-center justify-center text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg shadow-red-900/50">
                                            <Play size={24} fill="currentColor" className="ml-1" />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {posts.length > 0 && (
                <div className="flex justify-center mt-16">
                    <button className="bg-[var(--color-lgr-red)] hover:bg-red-700 text-white font-black uppercase tracking-widest px-10 py-4 rounded transition-colors text-sm">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
