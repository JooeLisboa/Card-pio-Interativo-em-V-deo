"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaImageProps = {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  wrapperClassName?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
};

export function MediaImage({
  src,
  alt,
  fill = true,
  width,
  height,
  sizes,
  priority,
  className,
  wrapperClassName,
  fallbackTitle = "Imagem indisponível",
  fallbackDescription = "Adicione uma foto para valorizar ainda mais este prato."
}: MediaImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldRenderImage = Boolean(src) && !hasError;
  const imageClassName = cn(
    "object-cover transition duration-500",
    isLoaded ? "scale-100 opacity-100" : "scale-[1.02] opacity-0",
    className
  );

  return (
    <div className={cn("relative isolate overflow-hidden bg-stone-100", wrapperClassName)}>
      {shouldRenderImage ? (
        <>
          {fill ? (
            <Image
              src={src ?? ""}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              className={imageClassName}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setHasError(true);
                setIsLoaded(false);
              }}
            />
          ) : (
            <Image
              src={src ?? ""}
              alt={alt}
              width={width ?? 1200}
              height={height ?? 900}
              sizes={sizes}
              priority={priority}
              className={imageClassName}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setHasError(true);
                setIsLoaded(false);
              }}
            />
          )}
          {!isLoaded ? <div className="absolute inset-0 animate-pulse bg-stone-200/90" /> : null}
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-stone-100 via-stone-100 to-stone-200 px-5 py-8 text-center text-stone-500">
          <div className="rounded-full bg-white/85 p-3 shadow-sm">
            {src ? <ImageIcon className="h-5 w-5 text-stone-500" /> : <Sparkles className="h-5 w-5 text-[var(--primary)]" />}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-stone-800">{fallbackTitle}</p>
            <p className="max-w-xs text-xs leading-5 text-stone-500">{fallbackDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
}
