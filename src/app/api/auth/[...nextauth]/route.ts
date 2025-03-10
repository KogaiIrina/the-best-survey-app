import NextAuth, { NextAuthOptions, User} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '../../../../../prisma/lib/prisma';
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordsMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id.toString(), 
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }: { session: Session, token: JWT }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT, user: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
  
  