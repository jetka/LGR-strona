"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Download, Heart, Share2, ZoomIn, MapPin, Calendar, Film } from "lucide-react";

export default function ArticleView({ post }: { post: any }) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const images = post.imageUrls || [];
    const hasImages = images.length > 0;

    // Format daty YYYY-MM-DD
    const formatDate = (date: Date) => {
        return new Date(date).toISOString().split('T')[0];
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

    // Pierwsze zdjęcie jako Hero
    const heroImage = images[0] || "https://images.unsplash.com/photo-1541625602330-2277a4c4618c?q=80&w=2070&auto=format&fit=crop";

    return (
        <div className="w-full bg-transparent min-h-screen text-gray-200 relative z-10">

            {/* 1. HERO SECTION (Zdjecie jako wielki baner z gradientem jak w 2 screenie) */}
            <div className="relative w-full h-[60vh] md:h-[70vh] flex items-end overflow-hidden pb-12">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                <div className="absolute inset-0 bg-black/20"></div> {/* Darken overall slightly */}

                <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 md:px-8">
                    <span className="bg-[var(--color-lgr-red)] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-4 inline-block">Feature Article</span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-gray-300 text-xs md:text-sm font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2 text-[var(--color-lgr-red)]"><Calendar size={16} /> {formatDate(post.createdAt)}</span>
                        <span className="flex items-center gap-2"><MapPin size={16} className="text-[var(--color-lgr-red)]" /> Limanowa, Polska</span>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT (Podzielony układ na 'The Spirit' i Resztę Textu) */}
            <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-16">
                    {/* Sidebar Text */}
                    <div className="md:col-span-4">
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-4">
                            The Spirit of the Ride
                        </h3>
                        <div className="w-12 h-[2px] bg-[var(--color-lgr-red)]"></div>
                    </div>

                    {/* Content HTML */}
                    <div className="md:col-span-8">
                        <div
                            className="text-gray-300 text-base md:text-lg leading-relaxed font-sans max-w-3xl prose prose-invert prose-p:mb-6"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>

                {/* RELACJA WIDEO (WYSRODKOWANA, POZA KOLUMNA TEKSTOWĄ) */}
                {post.videoUrl && (
                    <div className="w-full flex flex-col items-center justify-center mb-16">
                        <video src={post.videoUrl} controls className="w-full max-w-5xl aspect-video rounded-xl border border-white/10 shadow-2xl bg-black" />
                    </div>
                )}

                {/* LINIA ODDZIELAJĄCA GALERIĘ JAK W MOCKUPIE STITCH */}
                {hasImages && (
                    <div className="w-full h-[1px] bg-white/5 mb-16"></div>
                )}

                {/* 3. GRID ZDJĘĆ Z LIGHTBOXEM  (Styl z Screenshot 2) */}
                {hasImages && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-fr">
                        {images.map((src: string, index: number) => (
                            <motion.div
                                key={index}
                                layoutId={`img-${index}`}
                                onClick={() => setSelectedImage(index)}
                                className="relative aspect-square cursor-pointer overflow-hidden bg-black/50 hover:border hover:border-white/20 transition-all duration-300 group"
                            >
                                <motion.img
                                    src={src}
                                    alt={`Gallery img ${index}`}
                                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. LIGHTBOX Ovelay (Styl ze sreenshot 3) */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-[#151212]/95 backdrop-blur-md"
                        onClick={closeLightbox}
                    >
                        {/* Top Bar Lightbox */}
                        <div className="absolute top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-10">
                            <div className="flex items-center gap-4 text-white">
                                <span className="text-xs uppercase tracking-[0.2em] font-medium">LGR GALLERY</span>
                                <span className="bg-[var(--color-lgr-red)]/20 text-[var(--color-lgr-red)] text-xs font-bold px-2 py-0.5 rounded">
                                    {selectedImage + 1} / {images.length}
                                </span>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="hidden md:flex flex-col items-end text-right">
                                    <span className="text-white text-sm font-bold tracking-wide">{post.title}</span>
                                    <span className="text-gray-500 text-[10px] uppercase tracking-wider">Limanowska Grupa Rowerowa</span>
                                </div>
                                <button onClick={closeLightbox} className="text-gray-400 hover:text-white transition-colors p-2 z-[110] relative">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Main Expanded Image */}
                        <div className="relative w-full max-w-5xl md:h-[70vh] flex items-center justify-center p-4">

                            {/* Left Arrow */}
                            <button onClick={handlePrev} className="absolute left-4 md:left-8 p-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 hover:scale-110 transition-all z-20">
                                <ChevronLeft size={20} />
                            </button>

                            <motion.img
                                layoutId={`img-${selectedImage}`}
                                src={images[selectedImage]}
                                className="max-w-full max-h-full object-contain shadow-2xl"
                                onClick={(e) => e.stopPropagation()} // żeby klinknięcie w zdjęcie nie zamykało modala
                            />

                            {/* Right Arrow */}
                            <button onClick={handleNext} className="absolute right-4 md:right-8 p-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 hover:scale-110 transition-all z-20">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Bottom Details Lightbox (Thumbnails & Actions) */}
                        <div className="absolute bottom-6 flex flex-col items-center gap-4 w-full" onClick={(e) => e.stopPropagation()}>
                            {/* Miniatureki (zaznaczona z ramką) */}
                            <div className="hidden md:flex gap-2">
                                {images.slice(Math.max(0, selectedImage - 2), Math.min(images.length, selectedImage + 3)).map((src: string, i: number) => {
                                    const actualIndex = images.indexOf(src);
                                    return (
                                        <div
                                            key={actualIndex}
                                            onClick={() => setSelectedImage(actualIndex)}
                                            className={`w-12 h-12 overflow-hidden cursor-pointer transition-all ${actualIndex === selectedImage ? 'border-2 border-white scale-110 z-10 opacity-100' : 'opacity-40 hover:opacity-100 border border-transparent'}`}
                                        >
                                            <img src={src} className="w-full h-full object-cover" />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Ikony Akcji na ciemnym pasku */}
                            <div className="bg-black/50 border border-white/10 rounded-xl px-6 py-3 flex gap-6 text-gray-400">
                                <button className="hover:text-white transition-colors p-1"><Download size={16} /></button>
                                <button className="hover:text-[var(--color-lgr-red)] transition-colors p-1"><Heart size={16} /></button>
                                <button className="hover:text-white transition-colors p-1"><Share2 size={16} /></button>
                                <button className="hover:text-white transition-colors p-1"><ZoomIn size={16} /></button>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
