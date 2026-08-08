import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ADMIN_RESOURCES } from "@/lib/adminResources";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(
  request: Request,
  { params }: { params: { resource: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const config = ADMIN_RESOURCES[params.resource];
  if (!config) {
    return NextResponse.json({ error: "ไม่พบประเภทข้อมูลนี้" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = 50;
  const offset = (page - 1) * pageSize;

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM \`${config.table}\``
  );
  const total = countRows[0]?.total ?? 0;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM \`${config.table}\` ORDER BY sort_order, id LIMIT ? OFFSET ?`,
    [pageSize, offset]
  );

  return NextResponse.json({ items: rows, total, page, pageSize });
}

export async function POST(
  request: Request,
  { params }: { params: { resource: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }

  const config = ADMIN_RESOURCES[params.resource];
  if (!config) {
    return NextResponse.json({ error: "ไม่พบประเภทข้อมูลนี้" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const columns = config.fields.map((field) => field.key);
  const values = config.fields.map((field) => {
    const raw = body[field.key];
    if (field.type === "checkbox") return raw ? 1 : 0;
    if (field.type === "number") return Number(raw) || 0;
    return raw ?? "";
  });

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO \`${config.table}\` (${columns.map((c) => `\`${c}\``).join(", ")}, sort_order)
     VALUES (${columns.map(() => "?").join(", ")}, (SELECT next_order FROM (SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM \`${config.table}\`) AS t))`,
    values
  );

  return NextResponse.json({ id: result.insertId });
}
