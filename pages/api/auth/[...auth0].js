// import NextAuth from "next-auth";
// // import AppleProvider from "next-auth/providers/apple";
// // import FacebookProvider from "next-auth/providers/facebook";
// import GoogleProvider from "next-auth/providers/google";
// // import EmailProvider from "next-auth/providers/email";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "../../../lib/mongodb";

// export default NextAuth({
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     // OAuth authentication providers...
//     // AppleProvider({
//     //   clientId: process.env.APPLE_ID,
//     //   clientSecret: process.env.APPLE_SECRET,
//     // }),
//     // FacebookProvider({
//     //   clientId: process.env.FACEBOOK_ID,
//     //   clientSecret: process.env.FACEBOOK_SECRET,
//     // }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//     }),
//     // Passwordless / email sign in
//     // EmailProvider({
//     //   server: process.env.MAIL_SERVER,
//     //   from: "NextAuth.js <no-reply@example.com>",
//     // }),
//   ],
//   // pages: {
//   //   signIn: "/login",
//   // },
//   // secret: process.env.JWT_SECRET,
// });

// pages/api/auth/[...auth0].js
import { handleAuth } from "@auth0/nextjs-auth0";

export default handleAuth();
