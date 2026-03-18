"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, Trash2, UploadCloud, X, Film, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { deletePost } from "./actions";

export default function AdminClient({ initialPosts }: { initialPosts: any[] }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("STARTY");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [posts, setPosts] = useState(initialPosts);
  const [files, setFiles] = useState<File[]>([]);

  // Obsługa dropzone z react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      "video/*": [".mp4", ".webm"],
    },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
    if (!title || !content) return alert("Wypełnij tytuł i treść");

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    files.forEach((file) => {
      formData.append("media", file);
    });

    try {
      const response = await axios.post("/api/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        alert("Dodano nowy wpis do Supabase pomyślnie z " + response.data.mediaPaths.length + " plików mediów!");
        window.location.reload();
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
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12">
          Publikacja Artykułów z Mediami <span className="text-[var(--color-lgr-red)]"> LGR</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Formularz Dodawania z Dropzone */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 flex flex-col gap-6 h-fit">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-white border-b border-white/10 pb-4">
              Dodaj Nowy Wpis (Drop & Uplaod)
            </h2>

            <form className="flex flex-col gap-5" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Kategoria</label>
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
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Tytuł Z którego powstanie folder (slug)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-lgr-red)] focus:outline-none transition-colors"
                  placeholder="NP: IV Czasówka Rowerowa..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Treść (Używaj HTML)</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-lgr-red)] focus:outline-none transition-colors min-h-[150px]"
                  placeholder="Opisz wyjazd lub dodaj znaczniki <b>pogrubienia</b>..."
                />
              </div>

              {/* SEKACJA DRAG&DROP MEDIA */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Załączniki Media (Zdjęcia Webp/Jpg i Wideo MP4)</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
                  ${isDragActive ? 'border-[var(--color-lgr-red)] bg-red-900/10' : 'border-white/20 hover:border-white/50 bg-black/50'}`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-gray-300 text-center text-sm font-medium">
                    Przeciągnij i upuść pliki tutaj, aby dodać je do zewnętrznego serwera.
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Lub kliknij, aby wybrać z komputera (Aktywne: Pasek Progresu Uploadu Oparty Na Axios)</p>
                </div>

                {/* Podgląd plików (Preview) */}
                {files.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    {files.map((file, index) => {
                      const isVideo = file.type.startsWith("video/");
                      const objectUrl = URL.createObjectURL(file);

                      return (
                        <div key={index} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-square bg-black">
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white rounded p-1 z-20 transition-colors"
                          >
                            <X size={14} />
                          </button>

                          {isVideo ? (
                            <div className="w-full h-full flex items-center justify-center flex-col gap-2 relative">
                              <Film className="w-8 h-8 opacity-50" />
                              <span className="text-[10px] text-gray-400 truncate w-11/12 text-center absolute bottom-2">{file.name}</span>
                              <video src={objectUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 z-0" muted></video>
                            </div>
                          ) : (
                            <img src={objectUrl} className="w-full h-full object-cover" alt="Preview" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pasek postępu dla grubych plików 50MB+ */}
              {loading && progress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[var(--color-lgr-red)] mb-2">
                    <span>Wysyłanie plików...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-black rounded-full h-2">
                    <div
                      className="bg-[var(--color-lgr-red)] h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 px-6 py-4 bg-[var(--color-lgr-red)] disabled:bg-red-900 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save size={20} /> {loading ? "TRWA UPLOAD DO ZEWNETRZNEGO FOLDERU..." : "OPUBLIKUJ ARTYKUŁ"}
              </button>
            </form>
          </div>

          {/* Lista aktualnych wpisów -> Kasowanie */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-white border-b border-white/10 pb-4">
              Ostatnie Artykuły (Zarządzaj)
            </h2>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
              {posts.length === 0 && <p className="text-gray-500">Brak dodanych artykułów.</p>}

              {posts.map((post: any) => (
                <div key={post.id} className="bg-black/50 border border-white/10 rounded-xl p-4 flex flex-col gap-3 group hover:border-[var(--color-lgr-red)]/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/10 text-gray-300 rounded mb-2 inline-block">
                        {post.category}
                      </span>
                      <h3 className="font-bold text-white leading-tight mb-2">{post.title}</h3>
                      {(post.videoUrl || post.imageUrls?.length > 0) && (
                        <div className="flex items-center gap-2 text-xs text-[var(--color-lgr-red)] uppercase font-semibold">
                          {post.videoUrl && <span className="flex items-center gap-1"><Film size={12} /> 1 Wideo</span>}
                          {post.imageUrls?.length > 0 && <span className="flex items-center gap-1"><ImageIcon size={12} /> {post.imageUrls.length} Zdj.</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
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
