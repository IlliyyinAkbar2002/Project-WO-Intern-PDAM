import { NextResponse } from "next/server";

// GET: ambil daftar lokasi
export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      nama: "Kantor Pusat PDAM",
      latitude: -7.265352,
      longitude: 112.753434,
      radiusMeter: 500,
    },
    {
      id: 2,
      nama: "Cabang Ngagel",
      latitude: -7.299166,
      longitude: 112.745500,
      radiusMeter: 300,
    },
  ]);
}

// PATCH: update lokasi tertentu (dummy)
export async function PATCH(req: Request) {
  const body = await req.json();

  // contoh: update hanya mengembalikan data yang di-patch
  return NextResponse.json({
    ...body,
    updatedAt: new Date().toISOString(),
  });
}
