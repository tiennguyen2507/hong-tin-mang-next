import { NextResponse } from "next/server";
import { countUsers, createUser } from "@/lib/db/users";
import { signSessionToken } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/session";

const MIN_PASSWORD = 8;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: string;
      name?: string;
      password?: string;
    };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    if (password.length < MIN_PASSWORD) {
      return NextResponse.json(
        { error: `Mật khẩu tối thiểu ${MIN_PASSWORD} ký tự` },
        { status: 400 },
      );
    }
    const total = await countUsers();
    const role = total === 0 ? "admin" : "user";
    const user = await createUser({ email, name, role, password });
    try {
      const token = await signSessionToken({
        sub: user._id,
        email: user.email,
        role: user.role,
      });
      await setSessionCookie(token);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("AUTH_SECRET")) {
        return NextResponse.json(
          { error: "Đã tạo tài khoản nhưng chưa cấu hình AUTH_SECRET — không thể đăng nhập tự động." },
          { status: 500 },
        );
      }
      throw e;
    }
    return NextResponse.json({ user });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    const code = (e as { code?: number }).code;
    if (code === 11000) {
      return NextResponse.json({ error: "Email đã được sử dụng" }, { status: 409 });
    }
    const status = msg === "Database not configured" ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
