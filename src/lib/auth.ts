import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

import { clientPromise } from "./mongodb";

const mongoClient = await clientPromise;

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db("studiospace"), {
    client: mongoClient,
  }),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  // Google Login Configuration
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // Allow linking existing accounts with Google
 account: {
  accountLinking: {
    enabled: true,
    trustedProviders: ["google"],
    requireLocalEmailVerified: false,
  },
},

  plugins: [
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL,
        audience: process.env.BETTER_AUTH_URL,
        expirationTime: "15m",

        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],
});