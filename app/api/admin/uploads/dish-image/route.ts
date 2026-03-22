import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { dishUploadConfig, saveDishImageUpload } from "@/lib/uploads";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Selecione uma imagem para enviar." }, { status: 400 });
    }

    const imageUrl = await saveDishImageUpload(file);

    return NextResponse.json({
      imageUrl,
      maxBytes: dishUploadConfig.maxBytes,
      allowedMimeTypes: Array.from(dishUploadConfig.allowedMimeTypes)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível enviar a imagem.";
    const status = /autoriz|sessão|login/i.test(message) ? 401 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
