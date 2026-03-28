import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

// Helper: extract IP from request headers
function getClientIP(headersList: Headers): string {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" },
        honeypot: { label: "", type: "text" }, // Hidden honeypot field
      },
      async authorize(credentials, req) {
        // ── 1. Honeypot check — bots fill hidden fields ──
        if ((credentials as any)?.honeypot) {
          console.log("[SECURITY] Honeypot triggered — bot detected");
          throw new Error("Wykryto podejrzaną aktywność");
        }

        // ── 2. Zod validation ──
        const parsed = loginSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });

        if (!parsed.success) {
          const firstIssue = parsed.error.issues?.[0];
          throw new Error(firstIssue?.message || "Nieprawidłowe dane logowania");
        }

        const { email, password } = parsed.data;

        // ── 3. Rate limiting — max 5 attempts per 15 min per IP ──
        const headersList = await headers();
        const ip = getClientIP(headersList);
        const userAgent = headersList.get("user-agent") || "unknown";

        const rateLimitResult = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
        if (!rateLimitResult.success) {
          const minutesLeft = Math.ceil(rateLimitResult.resetIn / 60000);
          console.log(`[SECURITY] Rate limit exceeded for IP: ${ip}`);
          
          // Log failed attempt
          await prisma.adminLog.create({
            data: {
              email,
              ip,
              userAgent,
              success: false,
              action: "LOGIN_RATE_LIMITED",
              details: `Rate limit exceeded. Reset in ${minutesLeft} min.`,
            },
          });

          throw new Error(`Zbyt wiele prób logowania. Spróbuj ponownie za ${minutesLeft} minut.`);
        }

        // ── 4. Find user ──
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          await prisma.adminLog.create({
            data: {
              email,
              ip,
              userAgent,
              success: false,
              action: "LOGIN_FAILED",
              details: "User not found",
            },
          });
          throw new Error("Brak użytkownika o podanym adresie email");
        }

        // ── 5. Verify password (bcrypt hash comparison) ──
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          await prisma.adminLog.create({
            data: {
              email,
              ip,
              userAgent,
              success: false,
              action: "LOGIN_FAILED",
              details: "Invalid password",
            },
          });
          throw new Error("Błędne hasło");
        }

        // ── 6. Check admin role ──
        if (user.role !== "ADMIN") {
          await prisma.adminLog.create({
            data: {
              email,
              ip,
              userAgent,
              success: false,
              action: "LOGIN_DENIED",
              details: "User is not an admin",
            },
          });
          throw new Error("Brak uprawnień administratora");
        }

        // ── 7. Log successful login ──
        await prisma.adminLog.create({
          data: {
            email,
            ip,
            userAgent,
            success: true,
            action: "LOGIN",
            details: `Successful login as ${user.name || email}`,
          },
        });

        console.log(`[AUTH] Successful login: ${email} from IP: ${ip}`);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours (reduced from 30 days for security)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
