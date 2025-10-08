import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/lib/data"; // We'll use the mock data for now

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials: Record<"email" | "pin", string> | undefined) {
        if (!credentials) {
          return null;
        }

        // Find the user with the matching email
        const user = users.find((u) => u.email === credentials.email);

        // Check if user exists and if the PIN matches
        if (user && user.pin === credentials.pin) {
          // Any object returned will be saved in the `user` property of the JWT
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            // We pass the role here to be available in the session
            role: user.role,
          };
        } else {
          // If you return null then an error will be displayed
          return null;
        }
      },
    }),
  ],
  session: {
    // Use JSON Web Tokens for session handling
    strategy: "jwt",
  },
  callbacks: {
    // This callback is called whenever a JWT is created or updated.
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser & { role?: string } }) {
      // The `user` object is only available on the first sign-in.
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // This callback is called whenever a session is checked.
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        // Add id and role to the session object
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    // Redirect users to our custom login page
    signIn: "/login",
  },
  // You must provide a secret for production. Generate one with `openssl rand -base64 32`
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };