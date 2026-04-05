import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { signSessionToken } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/session";
import { getUserDocByEmail, normalizeRole } from "@/lib/db/users";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password) {
      return NextResponse.json({ error: "Email và mật khẩu là bắt buộc" }, { status: 400 });
    }
    const doc = await getUserDocByEmail(email);
    if (!doc?.passwordHash) {
      return NextResponse.json({ error: "Sai email hoặc mật khẩu" }, { status: 401 });
    }
    const ok = await verifyPassword(password, doc.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Sai email hoặc mật khẩu" }, { status: 401 });
    }
    const role = normalizeRole(String(doc.role));
    const token = await signSessionToken({
      sub: doc._id.toString(),
      email: doc.email,
      role,
    });
    await setSessionCookie(token);
    return NextResponse.json({
      user: {
        _id: doc._id.toString(),
        email: doc.email,
        name: doc.name,
        role,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    if (msg.includes("AUTH_SECRET")) {
      return NextResponse.json({ error: "Cấu hình máy chủ thiếu AUTH_SECRET" }, { status: 500 });
    }
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
