import { PrismaAdapter } from "@next-auth/prisma-adapter"; // Asegúrate de tener esto
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Importante para conectar bien con la DB
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Limpieza de datos
        const cleanEmail = credentials?.email?.toLowerCase().trim();
        const rawPassword = credentials?.password;

        if (!cleanEmail || !rawPassword) {
          throw new Error("Credenciales incompletas");
        }
        
        // 2. Buscar al usuario
        const user = await prisma.user.findUnique({
          where: { email: cleanEmail }
        });
        
        if (!user) {
          throw new Error("Correo no registrado o mal escrito");
        }

        // 3. Comparar la contraseña
        const isMatch = await bcrypt.compare(rawPassword, user.password || "");
        
        if (!isMatch) {
          throw new Error("La contraseña no coincide");
        }

        // 4. ACTUALIZAR 'updatedAt' (Esto activa el contador de Online en el Dashboard)
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { updatedAt: new Date() }
          });
        } catch (e) {
          console.error("Error actualizando last login", e);
        }
        
        console.log(`✅ AUTH: Login exitoso para: ${user.email}`);

        // 5. Retornar el objeto usuario
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image
        };
      }
    })
  ],
  session: { 
    strategy: "jwt", // Mantenemos JWT porque es lo mejor para Credentials
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.picture as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  debug: process.env.NODE_ENV === "development",
};