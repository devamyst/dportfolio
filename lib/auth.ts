import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { timingSafeEqual, scryptSync } from "node:crypto";

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminUsername = process.env.ADMIN_USERNAME ?? "";
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH ?? "";
        if (!credentials?.username || !credentials?.password) return null;
        if (credentials.username !== adminUsername) return null;
        if (!verifyPassword(credentials.password, adminPasswordHash)) return null;
        return { id: "admin", name: adminUsername };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
};
