import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./shared/lib/api";
import type { ActionResponses } from "./shared/types/global";
import type { IAccountDoc } from "./database/account.model";
import { SignInSchema } from "./features/auth/schema/auth-schema";
import type { IUserDoc } from "./database/user.model";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Github,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const { data: existingAccount } = (await api.accounts.getByProvider(
            email,
          )) as ActionResponses<IAccountDoc>;
          if (!existingAccount) return null;
          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString(),
          )) as ActionResponses<IUserDoc>;
          if (!existingUser) return null;
          const passwordsMatch = await bcrypt.compare(
            password,
            existingAccount.password!,
          );
          if (passwordsMatch)
            return {
              id: existingUser._id.toString(),
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId,
          )) as ActionResponses<IAccountDoc>;
        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;
        if (userId) token.sub = userId.toString();
      }
      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;
      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponses;

      if (!success) return false;
      return true;
    },
  },
});
