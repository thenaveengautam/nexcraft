import NextAuth, { CredentialsSignin } from "next-auth";

class CustomAuthError extends CredentialsSignin {
  code: string;
  constructor(message: string) {
    super();
    this.code = message;
  }
}
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CustomAuthError("Please enter email and password");
        }

        await dbConnect();

        const user = await User.findOne({ email: (credentials.email as string).toLowerCase() });

        if (!user) {
          throw new CustomAuthError("No account found with this email");
        }

        if (!user.password) {
          throw new CustomAuthError("This account uses Google sign-in. Please use Google to log in.");
        }

        if (!user.emailVerified) {
          throw new CustomAuthError("UNVERIFIED:" + user.email);
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new CustomAuthError("Incorrect password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();

        let existingUser = await User.findOne({ email: user.email?.toLowerCase() });

        if (!existingUser) {
          existingUser = await User.create({
            name: user.name,
            email: user.email?.toLowerCase(),
            image: user.image,
            emailVerified: true, // Google accounts are auto-verified
            plan: "free",
            usageCount: 0,
            usageResetDate: new Date(),
          });
        } else {
          // Update image if changed
          if (user.image && existingUser.image !== user.image) {
            existingUser.image = user.image;
            await existingUser.save();
          }
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email?.toLowerCase() });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.plan = dbUser.plan;
          token.usageCount = dbUser.usageCount;
          token.emailVerified = dbUser.emailVerified;
        }
      }

      // Update session when triggered
      if (trigger === "update" && session) {
        if (session.plan) token.plan = session.plan;
        if (session.usageCount !== undefined) token.usageCount = session.usageCount;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as unknown as Record<string, unknown>;
        u.id = token.id;
        u.plan = token.plan;
        u.usageCount = token.usageCount;
        u.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
});
