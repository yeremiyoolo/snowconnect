import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Limpieza absoluta de los datos de entrada
        const cleanEmail = credentials?.email?.toLowerCase().trim();
        const rawPassword = credentials?.password;

        if (!cleanEmail || !rawPassword) {
          console.log("❌ AUTH: Intento de login sin email o password");
          throw new Error("Credenciales incompletas");
        }
        
        // 2. Buscar al usuario
        const user = await prisma.user.findUnique({
          where: { email: cleanEmail }
        });
        
        // LOG DE DEPURACIÓN (Solo lo verás tú en la terminal)
        if (!user) {
          console.log(`❌ AUTH: Prisma no encontró el correo: [${cleanEmail}]`);
          // Tip: Si esto sale, entra a Prisma Studio y asegúrate de que el email no tenga espacios al final
          throw new Error("Correo no registrado o mal escrito");
        }

        console.log(`🔍 AUTH: Usuario encontrado: ${user.email}. Comparando password...`);

        // 3. Comparar la contraseña con bcrypt
        const isMatch = await bcrypt.compare(rawPassword, user.password);
        
        if (!isMatch) {
          console.log(`❌ AUTH: Password incorrecto para: ${cleanEmail}`);
          throw new Error("La contraseña no coincide");
        }
        
        console.log(`✅ AUTH: Login exitoso para: ${user.email}`);

        // 4. Retornar el objeto para la sesión
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  // Debug activado para ver el flujo del JWT en la terminal
  debug: process.env.NODE_ENV === "development",
};