"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Trash2, Edit2, Plus, UploadCloud, X, Film, Image as ImageIcon, ChevronLeft } from "lucide-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { deletePost } from "./actions";
import dynamic from "next/dynamic";

// Load editor only on client (it uses browser APIs)
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

type View = "list" | "editor";

interface FormState {
  id?: string;
  slug?: string;
  title: string;
  content: string;
  category: string;
}

const EMPTY_FORM: FormState = { title: "", content: "", category: "STARTY" };

export default function AdminClient({ initialPosts }: { initialPosts: any[] }) {
  const [view, setView] = useState<View>("list");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [posts, setPosts] = useState(initialPosts);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");

  // ── Dropzone ──
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      "video/*": [".mp4", ".webm"],
    },
  });

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  // ── Open editor to CREATE ──
  const openNew = () => {
    setForm(EMPTY_FORM);
    setFiles([]);
    setProgress(0);
    setView("editor");
  };

  // ── Open editor to EDIT ──
  const openEdit = (post: any) => {
    setForm({
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      category: post.category,
    });
    setFiles([]);
    setProgress(0);
    setView("editor");
  };

  // ── Delete ──
  const handleDelete = async (postId: string) => {
    if (!confirm("Na pewno usunąć ten wpis?")) return;
    setLoading(true);
    await deletePost(postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
    setLoading(false);
  };

  // ── Save / Update ──
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return alert("Wypełnij tytuł i treść");

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category", form.category);
    if (form.id) formData.append("postId", form.id);

    files.forEach(file => formData.append("media", file));

    try {
      const response = await axios.post("/api/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: progressEvent => {
          const pct = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(pct);
        },
      });

      if (response.data.success) {
        setSuccessMsg(form.id ? "Artykuł zaktualizowany!" : "Artykuł opublikowany!");
        setTimeout(() => setSuccessMsg(""), 3000);
        // Refresh posts list
        const updated = response.data.post;
        if (form.id) {
          setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
        } else {
          setPosts(prev => [updated, ...prev]);
        }
        setView("list");
      } else {
        alert("Błąd API: " + response.data.error);
      }
    } catch (err: any) {
      alert("Wystąpił błąd: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 min-h-screen text-gray-200">
      {/* ── PAGE HEADER ── */}
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[var(--color-lgr-red)] text-xs font-black uppercase tracking-[0.2em] block mb-2">
              Panel Zarządzania
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              Admin <span className="text-[var(--color-lgr-red)]">LGR</span>
            </h1>
          </div>

          {view === "list" && (
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-[var(--color-lgr-red)] hover:bg-red-700 text-white 
                         font-black uppercase tracking-widest px-6 py-3 rounded-lg transition-colors"
            >
              <Plus size={18} /> Nowy artykuł
            </button>
          )}
          {view === "editor" && (
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-2 text-gray-400 hover:text-white font-bold uppercase 
                         tracking-widest text-sm transition-colors"
            >
              <ChevronLeft size={16} /> Powrót do listy
            </button>
          )}
        </div>

        {/* Success toast */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-green-900/40 border border-green-500/30 text-green-300 px-5 py-3 
                         rounded-lg text-sm font-bold flex items-center gap-2"
            >
              ✓ {successMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ══════════════════════════════════════════
          VIEW: LIST
      ══════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {view === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {posts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-500 mb-6">Brak artykułów. Kliknij „Nowy artykuł" aby dodać pierwszy.</p>
                <button onClick={openNew} className="px-6 py-3 bg-[var(--color-lgr-red)] hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-lg">
                  <Plus size={16} className="inline mr-2" />Dodaj artykuł
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post: any, i: number) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 
                               hover:border-[var(--color-lgr-red)]/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="bg-[var(--color-lgr-red)]/20 text-[var(--color-lgr-red)] text-[10px] 
                                       font-black uppercase tracking-widest px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(post)}
                          className="p-2 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                          title="Edytuj"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={loading}
                          className="p-2 rounded bg-red-900/30 hover:bg-[var(--color-lgr-red)] text-red-300 hover:text-white transition-colors"
                          title="Usuń"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-black text-white text-lg leading-tight tracking-tight">
                      {post.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
                      {post.imageUrls?.length > 0 && (
                        <span className="flex items-center gap-1"><ImageIcon size={12} /> {post.imageUrls.length} zdjęć</span>
                      )}
                      {post.videoUrl && (
                        <span className="flex items-center gap-1 text-[var(--color-lgr-red)]"><Film size={12} /> Wideo</span>
                      )}
                      <span className="ml-auto">
                        {new Date(post.createdAt).toLocaleDateString("pl-PL")}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ══════════════════════════════════════════
            VIEW: EDITOR
        ══════════════════════════════════════════ */}
        {view === "editor" && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* ── LEFT SIDEBAR: metadata ── */}
              <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-5">
                <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col gap-5 sticky top-28">
                  <h2 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-4">
                    Szczegóły artykułu
                  </h2>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Kategoria
                    </label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm
                                 focus:border-[var(--color-lgr-red)] focus:outline-none transition-colors"
                    >
                      <option value="STARTY">Starty</option>
                      <option value="WYDARZENIA">Wydarzenie</option>
                      <option value="INNE">Trasa</option>
                      <option value="MEDIA">Media (Filmy)</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Tytuł artykułu
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm
                                 focus:border-[var(--color-lgr-red)] focus:outline-none transition-colors"
                      placeholder="Np: IV Czasówka pod Ostrą..."
                    />
                  </div>

                  {/* Media dropzone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Załączniki mediów
                    </label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center 
                                  justify-center cursor-pointer transition-colors duration-200 text-center
                                  ${isDragActive
                          ? "border-[var(--color-lgr-red)] bg-red-900/10"
                          : "border-white/15 hover:border-white/40 bg-black/30"
                        }`}
                    >
                      <input {...getInputProps()} />
                      <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                      <p className="text-gray-400 text-xs">Przeciągnij lub kliknij</p>
                      <p className="text-gray-600 text-[10px] mt-1">JPG, PNG, WebP, MP4</p>
                    </div>

                    {/* File previews */}
                    {files.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {files.map((file, idx) => {
                          const isVideo = file.type.startsWith("video/");
                          const url = URL.createObjectURL(file);
                          return (
                            <div key={idx} className="relative aspect-square rounded overflow-hidden bg-black border border-white/10 group">
                              <button
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded p-0.5 z-10 transition-colors"
                              >
                                <X size={10} />
                              </button>
                              {isVideo ? (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Film size={24} className="text-gray-500" />
                                </div>
                              ) : (
                                <img src={url} className="w-full h-full object-cover" alt="" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Upload progress */}
                  {loading && progress > 0 && (
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[var(--color-lgr-red)] mb-1.5">
                        <span>Wysyłanie...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-black rounded-full h-1.5">
                        <div
                          className="bg-[var(--color-lgr-red)] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[var(--color-lgr-red)] disabled:bg-red-900 hover:bg-red-700 
                               text-white font-black uppercase tracking-widest rounded-lg transition-colors 
                               flex items-center justify-center gap-2 text-sm"
                  >
                    <Save size={16} />
                    {loading ? "Zapisywanie..." : form.id ? "Zapisz zmiany" : "Opublikuj artykuł"}
                  </button>
                </div>
              </div>

              {/* ── RIGHT: WYSIWYG EDITOR ── */}
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
                <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
                  <h2 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-4 mb-6">
                    Treść artykułu (Edytor WYSIWYG)
                  </h2>
                  <RichTextEditor
                    value={form.content}
                    onChange={content => setForm(f => ({ ...f, content }))}
                  />
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
