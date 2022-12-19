import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../helpers/auth";
import { connectDatabase } from "../../../helpers/mongodbConnect";

export default NextAuth({
  session: {
    jwt: true,
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectDatabase();
        const db = client.db("bista");
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("email tidak terdaftar");
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Password tidak sesuai!");
        }
        client.close();
        return user;
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.nama = user.nama;
        token.posisi = user.posisi;
        token.posisiDesc = user.posisiDesc;
        token.cabang = user.cabang;
        token.cabangDesc = user.cabangDesc;
        token.email = user.email;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.nama = token.nama;
        session.posisi = token.posisi;
        session.posisiDesc = token.posisiDesc;
        session.cabang = token.cabang;
        session.cabangDesc = token.cabangDesc;
        session.email = token.email;
      }
      return session;
    },
  },
  secret: "q3t6w9z$C&F)asdfasdfasfasdfasdfasd1sdfasf",
});
