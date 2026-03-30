import { z } from "zod";

// ── Login validation ──
export const loginSchema = z.object({
  email: z
    .string()
    .email("Nieprawidłowy adres email")
    .max(255, "Email zbyt długi")
    .transform(v => v.trim().toLowerCase()),
  password: z
    .string()
    .min(1, "Hasło jest wymagane")
    .max(128, "Hasło zbyt długie"),
});

// ── Upload / Post creation validation ──
export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Tytuł jest wymagany")
    .max(300, "Tytuł zbyt długi")
    .transform(v => v.trim()),
  content: z
    .string()
    .min(1, "Treść jest wymagana")
    .max(30_000_000, "Treść jest niesamowicie długa (max 30MB) - upewnij się, że nie wklejasz zbyt wielu nieprzetworzonych zdjęć."), 
  category: z.enum(["STARTY", "WYDARZENIA", "INNE", "MEDIA"]),
});

// ── Delete post validation ──
export const deletePostSchema = z.object({
  postId: z
    .string()
    .uuid("Nieprawidłowy identyfikator postu"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type DeletePostInput = z.infer<typeof deletePostSchema>;
