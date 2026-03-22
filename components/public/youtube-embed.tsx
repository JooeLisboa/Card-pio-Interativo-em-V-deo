import { PlayCircle } from "lucide-react";

export function YoutubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-stone-950 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4 text-sm font-semibold text-white/90">
        <PlayCircle className="h-4 w-4 text-[var(--secondary)]" />
        Vídeo do prato
      </div>
      <div className="aspect-[16/11] w-full bg-stone-950 sm:aspect-video">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="Vídeo do prato"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
