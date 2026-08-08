import crypto from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export const SESSION_COOKIE = "nb_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type UserRole = "admin" | "member";

export interface SessionUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await pool.query(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
    [token, userId, expiresAt]
  );

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await pool.query("DELETE FROM sessions WHERE token = ?", [token]);
  }
  cookies().delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id, u.full_name AS fullName, u.email, u.role
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > NOW()`,
    [token]
  );

  if (rows.length === 0) return null;
  return rows[0] as SessionUser;
}
