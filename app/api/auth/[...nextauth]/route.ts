import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { createServerClient } from "@/lib/supabaseServer";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn callback triggered:", { user, account });

      if (user && account) {
        try {
          const supabase = await createServerClient();
          console.log("Attempting to store user in database:", user);

          // Let Supabase generate the UUID automatically
          const { data, error } = await supabase.from("users").upsert(
            {
              email: user.email,
              name: user.name,
              image: user.image,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "email", // Use email as conflict resolution
            }
          );

          if (error) {
            console.error("Database error storing user:", error);
            // Don't allow sign in if DB fails - this prevents infinite loops
            return false;
          }

          console.log("User stored successfully:", data);
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          // Don't allow sign in if there's an error
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // When user first signs in, store their email in the token
        token.email = user.email;
      }
      return token;
    },
    async session({ session }) {
      // Simple session callback - user ID will be fetched by useAuth hook
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
