import { NextResponse } from "next/server";
import { z } from "zod";
import { incrementDishView } from "@/lib/data";

const payloadSchema = z.object({
  dishId: z.string().min(1),
  tableId: z.string().optional().nullable()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
    }

    await incrementDishView({
      dishId: parsed.data.dishId,
      tableId: parsed.data.tableId ?? null
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível registrar a visualização." }, { status: 500 });
  }
}
