import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function extractYoutubeVideoId(url?: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "") || null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1] || null;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1] || null;
      }
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
  const message = `Olá, quero pedir 1 ${params.dishName}.${params.tableLabel ? ` ${params.tableLabel}.` : ""}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message.trim())}`;
}
