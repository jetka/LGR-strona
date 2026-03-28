"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Download, Heart, Share2, ZoomIn, MapPin, Calendar, Film, ArrowLeft, Bike, Mountain, LineChart } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ElevationChart from "./ElevationChart";

const RouteMap = dynamic(() => import("./RouteMap"), { ssr: false });

const FALLBACK_IMAGES = [
    "http://localhost:8080/articles/2026-03-17-zdjecia/650846985_934486416005084_5088040843992929697_n.jpg",
    "http://localhost:8080/articles/2026-03-17-zdjecia/650916792_934486516005074_8768591359964104230_n.jpg",
    "http://localhost:8080/articles/2026-03-17-zdjecia/651005253_934486732671719_3895271009930800358_n.jpg",
];

export default function ArticleView({ post }: { post: any }) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const images = post.imageUrls || [];
    const hasImages = images.length > 0;
    const hasVideo = !!post.videoUrl;

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImage !== null) {
            setSelectedImage((prev) => (prev! + 1) % images.length);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImage !== null) {
            setSelectedImage((prev) => (prev! - 1 + images.length) % images.length);
        }
    };

    const closeLightbox = () => setSelectedImage(null);

    const heroImage = post.category === "INNE" ? "/trasyBG.jpg" : (images[0] || FALLBACK_IMAGES[0]);

    return (
        <div className="w-full bg-transparent min-h-screen text-gray-200 relative z-10 pb-32">

            {/* ── BUTTON POWROTU ── */}
            <div className="absolute top-8 left-4 md:left-8 z-50">
                <Link
                    href=".."
                    className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white hover:bg-[var(--color-lgr-red)] transition-all"
                >
                    <ArrowLeft size={14} /> Powrót
                </Link>
            </div>

            {/* ── 1. HERO SECTION ── */}
            <div className="relative w-full h-[60vh] md:h-[75vh] flex items-end overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>

                <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 md:px-8 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="bg-[var(--color-lgr-red)] text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 mb-6 inline-block">
                            {post.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2 text-[var(--color-lgr-red)]">
                                <Calendar size={16} /> {formatDate(post.createdAt)}
                            </span>
                            <span className="flex items-center gap-2">
                                <MapPin size={16} className="text-[var(--color-lgr-red)]" /> Limanowa, Polska
                            </span>
                            {hasVideo && (
                                <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                    <Film size={14} className="text-[var(--color-lgr-red)]" /> Relacja Wideo
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── 2. MAIN CONTENT ── */}
            <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24">
                
                {/* ── GPX MAP & STATS SECTION ── */}
                {post.gpxUrl && post.routeData && (
                    <div className="mb-20">
                        <RouteMap routeData={post.routeData} />
                        
                        {/* Wstawienie Wykresu wysokości (teraz nad statystykami) */}
                        <ElevationChart routeData={post.routeData} />

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 max-w-xl mx-auto">
                            <div className="bg-[#111] border border-white/5 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                                <Bike className="text-[var(--color-lgr-red)] mb-1" size={20} />
                                <span className="text-gray-500 text-[8px] uppercase font-bold tracking-widest mb-0.5">Dystans</span>
                                <span className="text-base font-black text-white">{post.distance || 0} km</span>
                            </div>
                            <div className="bg-[#111] border border-white/5 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                                <Mountain className="text-[var(--color-lgr-red)] mb-1" size={20} />
                                <span className="text-gray-500 text-[8px] uppercase font-bold tracking-widest mb-0.5">Przewyższenie</span>
                                <span className="text-base font-black text-white">{post.elevation || 0} m+</span>
                            </div>
                            <div className="bg-[#111] border border-white/5 rounded-xl p-2 flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
                                <a 
                                    href={post.gpxUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[var(--color-lgr-red)] hover:bg-red-700 w-full h-full min-h-[50px] flex flex-col items-center justify-center rounded-lg transition-colors group cursor-pointer"
                                >
                                    <Download className="text-white mb-1 group-hover:scale-110 transition-transform" size={18} />
                                    <span className="text-white text-[9px] font-black uppercase tracking-widest">GPX</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-20">
                    {/* Sidebar Title */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
                            Pasja i&nbsp;determinacja na&nbsp;każdym metrze
                        </h3>
                        <div className="w-12 h-[2px] bg-[var(--color-lgr-red)] mb-8"></div>

                        <div className="hidden md:block">
                            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest leading-loose">
                                Redakcja LGR<br />Limanowa, Małopolska<br />2026 Archiwum
                            </p>
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="md:col-span-8 lg:col-span-9">
                            <div
                                className="text-gray-200 text-lg md:text-xl leading-relaxed font-sans prose prose-invert max-w-none prose-p:mb-8 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-white prose-a:text-[var(--color-lgr-red)] prose-img:rounded-2xl"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>
                    </div>

                    {/* ── 3. VIDEO SECTION ── */}
                    {hasVideo && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="w-full flex flex-col items-center justify-center mb-24"
                        >
                            <div className="w-full h-[1px] bg-white/5 mb-16"></div>
                            <div className="text-center mb-10">
                                <span className="text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-[0.3em] mb-4 block">Oficjalna Relacja</span>
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Obejrzyj Wideo</h2>
                            </div>
                            <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black relative group">
                                <video
                                    controls
                                    playsInline
                                    className="w-full h-full object-cover"
                                >
                                    <source
                                        src={post.videoUrl!}
                                        type={
                                            post.videoUrl!.endsWith(".webm") ? "video/webm" :
                                                post.videoUrl!.endsWith(".ogg") ? "video/ogg" :
                                                    "video/mp4"
                                        }
                                    />
                                    Twoja przeglądarka nie obsługuje odtwarzacza wideo.
                                </video>
                            </div>
                        </motion.div>
                    )}

                    {/* ── 4. GALLERY GRID ── */}
                    {hasImages && (
                        <div className="mt-20">
                            <div className="w-full h-[1px] bg-white/5 mb-16"></div>
                            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                                <div>
                                    <span className="text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-[0.3em] mb-4 block">Galeria Zdjęć</span>
                                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">Uchwycone Chwile</h2>
                                </div>
                                <p className="text-gray-500 text-sm font-medium italic">Kliknij zdjęcie, aby powiększyć →</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-fr">
                                {images.map((src: string, index: number) => (
                                    <motion.div
                                        key={index}
                                        layoutId={`img-${index}`}
                                        onClick={() => setSelectedImage(index)}
                                        whileHover={{ scale: 1.02 }}
                                        className="relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-[#111] border border-white/5 group"
                                    >
                                        <motion.img
                                            src={src}
                                            alt={`Galeria ${index}`}
                                            className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        <div className="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ZoomIn size={20} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── 5. LIGHTBOX OVERLAY ── */}
                <AnimatePresence>
                    {selectedImage !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-[#050505]/fb backdrop-blur-xl"
                            onClick={closeLightbox}
                        >
                            {/* Top Bar Lightbox */}
                            <div className="absolute top-0 left-0 w-full px-8 py-8 flex justify-between items-center z-10">
                                <div className="flex items-center gap-6 text-white font-black uppercase tracking-[0.3em] text-[10px]">
                                    <span>LGR ARCHIWUM</span>
                                    <span className="bg-[var(--color-lgr-red)] text-white px-3 py-1">
                                        {selectedImage + 1} / {images.length}
                                    </span>
                                </div>

                                <button onClick={closeLightbox} className="bg-white/10 hover:bg-[var(--color-lgr-red)] text-white transition-all p-3 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Main Expanded Image */}
                            <div className="relative w-full max-w-6xl h-[70vh] flex items-center justify-center p-4">
                                <button onClick={handlePrev} className="absolute left-4 md:left-12 p-5 bg-white/5 hover:bg-[var(--color-lgr-red)] rounded-full text-white transition-all z-20">
                                    <ChevronLeft size={24} />
                                </button>

                                <motion.img
                                    layoutId={`img-${selectedImage}`}
                                    src={images[selectedImage]}
                                    className="max-w-full max-h-full object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                                    onClick={(e) => e.stopPropagation()}
                                />

                                <button onClick={handleNext} className="absolute right-4 md:right-12 p-5 bg-white/5 hover:bg-[var(--color-lgr-red)] rounded-full text-white transition-all z-20">
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            {/* Bottom Thumbnails */}
                            <div className="absolute bottom-10 hidden md:flex gap-3" onClick={(e) => e.stopPropagation()}>
                                {images.map((src: string, i: number) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-14 h-14 rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${i === selectedImage ? 'border-[var(--color-lgr-red)] scale-110 opacity-100' : 'border-transparent opacity-30 hover:opacity-100'}`}
                                    >
                                        <img src={src} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
        </div>
    );
}
