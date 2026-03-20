"use client";

import Image from "next/image";
import { Download, ExternalLink, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DishQrDialog({
  dishName,
  dishSlug,
  dishUrl,
  qrCode,
}: {
  dishName: string;
  dishSlug: string;
  dishUrl: string;
  qrCode: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="min-h-11 flex-1 sm:flex-none">
          <QrCode className="mr-2 h-4 w-4" />
          Ver QR
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code do prato</DialogTitle>
          <DialogDescription>
            Abra ou compartilhe o acesso público de <strong>{dishName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 rounded-[28px] bg-stone-50 p-4 sm:p-5">
          <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-sm">
            <Image
              src={qrCode}
              alt={`QR do prato ${dishName}`}
              width={320}
              height={320}
              className="mx-auto h-auto w-full max-w-64 rounded-2xl"
            />
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-stone-900">{dishName}</p>
            <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                URL pública
              </p>
              <p className="mt-2 break-all text-sm leading-6 text-stone-600">
                {dishUrl}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="min-h-11">
              Fechar
            </Button>
          </DialogClose>
          <Button asChild variant="outline" className="min-h-11">
            <a href={dishUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir página
            </a>
          </Button>
          <Button asChild className="min-h-11">
            <a href={qrCode} download={`qr-${dishSlug}.png`}>
              <Download className="mr-2 h-4 w-4" />
              Baixar QR
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
