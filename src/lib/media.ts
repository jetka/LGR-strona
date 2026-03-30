/**
 * Zwraca pełny URL do pliku multimedialnego.
 * Jeśli ścieżka zaczyna się od http, zwraca ją bez zmian.
 * Jeśli jest relatywna (np. /articles/...), dokleja bazowy URL z .env
 */
export function getMediaUrl(path: string | null | undefined): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    
    const baseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "http://localhost:8080";

    
    const cleanBase = baseUrl.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    const finalUrl = `${cleanBase}${cleanPath}`;
    return finalUrl;
}
