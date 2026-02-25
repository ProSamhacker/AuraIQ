import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertUser } from "@/db/queries";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // Always allow sign-in — DB upsert is best-effort
            if (!user.email) return false;

            // Attempt to persist user — if DB fails, still allow auth
            try {
                await upsertUser(
                    user.email,
                    user.name ?? undefined,
                    user.image ?? undefined
                );
            } catch (err) {
                // Log but don't block sign-in — user can still use the app
                console.error("[Auth] DB upsert failed (non-blocking):", err);
            }

            return true;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.AUTH_SECRET,
});
