"use client";

import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DishImageUploadProps = {
  value?: string;
  onChange: (value: string) => void;
};

const acceptedFiles = "image/jpeg,image/png,image/webp,image/avif";

export function DishImageUpload({ value, onChange }: DishImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads/dish-image", {
        method: "POST",
        body: formData
      });

      const result = (await response.json()) as { imageUrl?: string; error?: string };

      if (!response.ok || !result.imageUrl) {
        throw new Error(result.error ?? "Não foi possível concluir o upload da imagem.");
      }

      onChange(result.imageUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Erro ao enviar a imagem.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleRemove() {
    setError(null);
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative overflow-hidden rounded-[28px] border border-dashed border-[var(--border)] bg-stone-50/80",
          value ? "min-h-64" : "min-h-56"
        )}
      >
        {value ? (
          <>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={value}
                alt="Prévia da foto do prato"
                fill
                className="object-cover"
                sizes="(min-width: 1536px) 420px, (min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent p-4 text-white">
              <p className="text-sm font-semibold">Prévia da foto do prato</p>
              <p className="mt-1 text-xs text-white/80">
                A imagem será usada no card do admin e na página pública do prato.
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-56 flex-col items-center justify-center gap-3 px-5 py-8 text-center">
            <div className="rounded-full bg-white p-4 shadow-sm">
              <ImagePlus className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-stone-900">Envie a foto do prato</p>
              <p className="text-xs leading-5 text-stone-500">
                JPG, PNG, WebP ou AVIF com até 5 MB. Ideal para fotos verticais ou quadradas bem iluminadas.
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={acceptedFiles}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="min-h-12 w-full justify-center gap-2"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {value ? "Trocar foto" : "Selecionar foto"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="min-h-12 w-full justify-center gap-2 border border-transparent"
          onClick={handleRemove}
          disabled={isUploading || !value}
        >
          <Trash2 className="h-4 w-4" />
          Remover foto
        </Button>
      </div>

      {value ? (
        <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Origem da mídia</p>
          <p className="mt-2 break-all text-sm leading-6 text-stone-600">{value}</p>
        </div>
      ) : null}

      {error ? (
        <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <X className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  );
}
