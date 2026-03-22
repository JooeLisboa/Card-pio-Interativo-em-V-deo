"use client";

import { useState } from "react";
import { PlayCircle, VideoOff } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";

type YoutubeEmbedProps = {
  videoId: string;
  fallbackImageUrl?: string | null;
  dishName?: string;
};

export function YoutubeEmbed({ videoId, fallbackImageUrl, dishName }: YoutubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-stone-950 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4 text-sm font-semibold text-white/90">
        <PlayCircle className="h-4 w-4 text-[var(--secondary)]" />
        Vídeo do prato
      </div>
      <div className="relative aspect-[16/11] w-full bg-stone-950 sm:aspect-video">
        {!isLoaded ? (
          <div className="absolute inset-0">
            <MediaImage
              src={fallbackImageUrl ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt={dishName ? `Prévia do vídeo de ${dishName}` : "Prévia do vídeo do prato"}
              wrapperClassName="h-full w-full"
              sizes="100vw"
              fallbackTitle="Carregando vídeo do prato"
              fallbackDescription="Se o player demorar, você ainda pode continuar avaliando a oferta abaixo."
            />
            <div className="absolute inset-0 flex items-center justify-center bg-stone-950/35 backdrop-blur-[2px]">
              <div className="rounded-full bg-white/92 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg">
                Carregando player...
              </div>
            </div>
          </div>
        ) : null}

        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={dishName ? `Vídeo do prato ${dishName}` : "Vídeo do prato"}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      <div className="flex items-start gap-2 border-t border-white/10 px-5 py-3 text-xs leading-5 text-white/70">
        <VideoOff className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
        <span>Se o vídeo não abrir corretamente no seu navegador, a página continua utilizável com foto, preço, descrição e CTA de pedido.</span>
      </div>
    </div>
  );
}
