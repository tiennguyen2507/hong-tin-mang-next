import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/lib/models";

export type SessionPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET?.trim();
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET must be set (min 16 characters)");
  }
  return new TextEncoder().encode(s);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const key = getSecret();
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

/** Dùng trong middleware (Edge) — không throw nếu thiếu secret; caller xử lý. */
export function getJwtSecretBytes(): Uint8Array | null {
  const s = process.env.AUTH_SECRET?.trim();
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const key = getSecret();
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    const sub = typeof payload.sub === "string" ? payload.sub : "";
    const email = typeof payload.email === "string" ? payload.email : "";
    const role = payload.role === "admin" || payload.role === "user" ? payload.role : null;
    if (!sub || !email || !role) return null;
    return { sub, email, role };
  } catch {
    return null;
  }
}
