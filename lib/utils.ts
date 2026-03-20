import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const YOUTUBE_HOSTS = new Set([
  "youtu.be",
  "www.youtu.be",
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com"
]);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function sanitizeWhatsAppNumber(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeYoutubeId(candidate?: string | null) {
  if (!candidate) return null;

  const cleaned = candidate.trim().replace(/[?&].*$/, "");
  return /^[A-Za-z0-9_-]{11}$/.test(cleaned) ? cleaned : null;
}

export function extractYoutubeVideoId(input?: string | null) {
  if (!input) return null;

  const directId = normalizeYoutubeId(input);
  if (directId) return directId;

  try {
    const parsed = new URL(input);
    const hostname = parsed.hostname.toLowerCase();

    if (!YOUTUBE_HOSTS.has(hostname)) {
      return null;
    }

    if (hostname.includes("youtu.be")) {
      return normalizeYoutubeId(parsed.pathname.split("/").filter(Boolean)[0]);
    }

    if (parsed.pathname === "/watch") {
      return normalizeYoutubeId(parsed.searchParams.get("v"));
    }

    const pathSegments = parsed.pathname.split("/").filter(Boolean);
    const [first, second] = pathSegments;

    if (["embed", "shorts", "live", "v"].includes(first ?? "")) {
      return normalizeYoutubeId(second);
    }
  } catch {
    return null;
  }

  return null;
}

export function buildWhatsAppUrl(params: {
  phone: string;
  dishName: string;
  tableLabel?: string | null;
}) {
  const phone = sanitizeWhatsAppNumber(params.phone);
  const tableSnippet = params.tableLabel ? ` ${params.tableLabel}.` : "";
  const message = `Olá, quero pedir 1 ${params.dishName}.${tableSnippet}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message.trim())}`;
}

export function buildMenuQuery(params: { table?: string | null; q?: string | null }) {
  const searchParams = new URLSearchParams();

  if (params.table) {
    searchParams.set("table", params.table);
  }

  if (params.q?.trim()) {
    searchParams.set("q", params.q.trim());
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function buildMenuUrl(params: {
  restaurantSlug: string;
  dishSlug?: string;
  table?: string | null;
  q?: string | null;
}) {
  const basePath = params.dishSlug
    ? `/menu/${params.restaurantSlug}/dish/${params.dishSlug}`
    : `/menu/${params.restaurantSlug}`;

  return `${basePath}${buildMenuQuery({ table: params.table, q: params.q })}`;
}
