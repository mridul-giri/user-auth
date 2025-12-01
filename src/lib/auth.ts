import { config } from "@/config/config";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { signInSchema } from "@/schema/signInSchema";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "write your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const parsed = signInSchema.safeParse(credentials);
          if (!parsed.success) return null;
          const { email, password } = parsed.data;
          const userExist = await prisma.user.findUnique({ where: { email } });
          if (!userExist || !userExist.password) {
            console.log("User doesn't exist");
            return null;
          }
          const isValid = await bcrypt.compare(password, userExist.password);
          if (!isValid) {
            console.log("Incorrect password");
            return null;
          }
          return userExist;
        } catch (error: any) {
          console.log("Auth Options Error: ", error);
          throw new Error("nextAuth Error", error);
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  secret: config.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token }: { token: any }) {
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: { signIn: "/register" },
};
