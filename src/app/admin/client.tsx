"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, FileVideo, Edit, Trash2 } from "lucide-react";
import { savePost, deletePost } from "./actions";

export default function AdminClient({ initialPosts }: { initialPosts: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("STARTY");
  const [gpxUrl, setGpxUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useState(initialPosts);

  const startEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setGpxUrl(post.gpxUrl || "");
    setVideoUrl(post.videoUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setCategory("STARTY");
    setGpxUrl("");
    setVideoUrl("");
    setVideoFile(null);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Na pewno usunąć ten wpis?")) return;
    setLoading(true);
    await deletePost(postId);
    setPosts(posts.filter((p: any) => p.id !== postId));
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (gpxUrl) formData.append("gpxUrl", gpxUrl);
    if (videoUrl) formData.append("videoUrl", videoUrl);
    if (videoFile) formData.append("videoFile", videoFile);

    try {
      await savePost(formData, editingId || undefined);
      alert(editingId ? "Zaktualizowano!" : "Dodano nowy wpis!");
      window.location.reload(); // Prosty sposób na odświeżenie listy postów z bazy
    } catch (err: any) {
      alert("Wystąpił błąd: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 min-h-screen text-gray-200">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12">
          Panel Administratora <span className="text-[var(--color-lgr-red)]">(CMS)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Formularz Edycji/Dodawania */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 flex flex-col gap-6 h-fit">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-white border-b border-white/10 pb-4">
              {editingId ? "Edytuj wpis" : "Dodaj Nowy Wpis (Artykuł/Film)"}
            </h2>
            
            <form className="flex flex-col gap-4" onSubmit={handleSave}>
              <div>
                <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">Kategoria</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-lgr-red)] focus:outline-none transition-colors"
                >
                  <option value="STARTY">Starty (Artykuły)</option>
                  <option value="WYDARZENIA">Wydarzenia</option>
                  <option value="MEDIA">Media (Filmy)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">Tytuł</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-lgr-red)] focus:outline-none transition-colors" 
                  placeholder="Nagłówek..." 
                />
              </div>
              
              <div>
                <label className="block text-sm uppercase tracking-widest text-gray-500 mb-1">Treść (Można używać HTML)</label>
                <textarea 
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-lgr-red)] focus:outline-none transition-colors min-h-[150px]" 
                  placeholder="Opisz wyjazd lub dodaj znaczniki <b>pogrubienia</b>..."
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <label className="block text-sm uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                  <FileVideo size={16}/> Media (Film MP4)
                </label>
                <div className="flex flex-col gap-2">
                   <p className="text-xs text-gray-400">Możesz wrzucić plik mp4 z komputera (trafi do /public/media):</p>
                   <input 
                     type="file" 
                     accept="video/mp4,video/x-m4v,video/*"
                     onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                     className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-lgr-red)] file:text-white hover:file:bg-red-700 bg-black/50 p-2 rounded"
                   />
                   <p className="text-xs w-full text-center my-0 py-0">lub podaj adres ręcznie:</p>
                   <input 
                    type="text" 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-sm" 
                    placeholder="np. /media/film.mp4" 
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[var(--color-lgr-red)] hover:bg-red-700 text-white font-bold uppercase tracking-wide rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {loading ? "Zapisywanie..." : "Zapisz"}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={cancelEdit}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wide rounded-lg transition-colors"
                  >
                    Anuluj
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista aktualnych wpisów */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-white border-b border-white/10 pb-4">
              Twoje Artykuły
            </h2>
            
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {posts.length === 0 && <p className="text-gray-500">Brak dodanych artykułów.</p>}
              
              {posts.map((post: any) => (
                <div key={post.id} className="bg-black/50 border border-white/10 rounded-xl p-4 flex flex-col gap-3 group hover:border-[var(--color-lgr-red)]/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/10 text-gray-300 rounded mb-2 inline-block">
                        {post.category}
                      </span>
                      <h3 className="font-bold text-white leading-tight">{post.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(post)} className="p-2 bg-blue-900/50 hover:bg-blue-600 rounded text-blue-200 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} disabled={loading} className="p-2 bg-red-900/50 hover:bg-[var(--color-lgr-red)] rounded text-red-200 hover:text-white transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
