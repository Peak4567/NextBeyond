import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ADMIN_RESOURCES } from "@/lib/adminResources";

export async function DELETE(
  _request: Request,
  { params }: { params: { resource: string; id: string } }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const config = ADMIN_RESOURCES[params.resource];
  if (!config) {
    return NextResponse.json({ error: "ไม่พบประเภทข้อมูลนี้" }, { status: 404 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "รหัสไม่ถูกต้อง" }, { status: 400 });
  }

  await pool.query(`DELETE FROM \`${config.table}\` WHERE id = ?`, [id]);

  return NextResponse.json({ ok: true });
}
