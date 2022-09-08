import NextAuth from "next-auth"; 
import Providers from "next-auth/providers";

import { connectToDB } from "../../../lib/db";
import { matchPassword } from "../../../lib/auth"; 

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Credentials",
            
      async authorize(credentials, req) {
        const { email:enteredEmail, password:enteredPassword } = credentials;
        const client = await connectToDB();
        const usersCollection = client.db().collection('users');
        const user = await usersCollection.findOne({ email: enteredEmail});
        
        if (!user) { 
          return false;
        }
        const { email, password:hashedPassword } = user;
        const isValid = await matchPassword(enteredPassword, hashedPassword);
        if(!isValid){
          return false;
        }
        return { email: email };
      }
    }),
  ],
  session: {
    jwt: true,
  }
});
