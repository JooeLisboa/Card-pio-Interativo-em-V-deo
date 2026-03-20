import { PlayCircle } from "lucide-react";

export function YoutubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="surface overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-4 text-sm font-semibold text-stone-700">
        <PlayCircle className="h-4 w-4 text-[var(--primary)]" />
        Vídeo do prato
      </div>
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Vídeo do prato"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
