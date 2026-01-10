"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Clock, Mail, MapPin } from "lucide-react";

// Icono de TikTok personalizado
const TikTokIcon = ({ size = 18, className }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 pt-24 pb-12 relative overflow-hidden">
      
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20 text-center md:text-left">
          
          {/* COLUMNA 1: MARCA Y REDES */}
          <div className="lg:col-span-4 space-y-8 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3 group">
              {/* LOGO CON FONDO BLANCO */}
              <div className="relative w-14 h-14 overflow-hidden rounded-xl bg-white shadow-lg shadow-gray-200/50">
                <div className="w-full h-full flex items-center justify-center p-2">
                   <Image src="/logo.png" alt="SnowConnect" width={56} height={56} className="object-contain" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none">
                Snow<span className="text-blue-500">Connect</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-sm">
              Redefiniendo la compra de tecnología seminueva en RD. 
              Equipos verificados y garantía certificada.
            </p>
            
            {/* REDES SOCIALES */}
            <div className="flex items-center gap-4">
              <SocialButton icon={Instagram} href="#" label="Instagram" />
              <SocialButton icon={Facebook} href="#" label="Facebook" />
              <SocialButton icon={TikTokIcon} href="#" label="TikTok" />
              <SocialButton icon={Mail} href="mailto:contacto@snowconnect.com" label="Correo" />
            </div>
          </div>

          {/* COLUMNA 2: TIENDA */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white mb-8">Tienda</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500 dark:text-gray-400">
              <li><FooterLink href="/catalogo">Catálogo Completo</FooterLink></li>
              <li><FooterLink href="/catalogo?marca=Apple">iPhones</FooterLink></li>
              <li><FooterLink href="/catalogo?marca=Samsung">Samsung Galaxy</FooterLink></li>
              <li><FooterLink href="/catalogo?oferta=true">Ofertas Flash 🔥</FooterLink></li>
            </ul>
          </div>

          {/* COLUMNA 3: SOPORTE */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white mb-8">Soporte</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500 dark:text-gray-400">
              <li><FooterLink href="/garantia">Garantía Snow™</FooterLink></li>
              <li><FooterLink href="/envios">Rastrea tu Orden</FooterLink></li>
              <li><FooterLink href="/contacto">Centro de Ayuda</FooterLink></li>
              <li><FooterLink href="/servicios">Vender mi Equipo</FooterLink></li>
            </ul>
          </div>

          {/* COLUMNA 4: UBICACIÓN Y HORARIO */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white mb-8">Ubicación</h4>
            
            <div className="space-y-6 w-full">
              <div className="flex items-start gap-4 text-sm font-bold text-gray-500 dark:text-gray-400 justify-center md:justify-start group cursor-default">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                   <MapPin size={20} />
                </div>
                <div>
                   <p className="text-gray-900 dark:text-white mb-1">Tienda 100% Virtual</p>
                   <p className="text-xs font-medium">Santiago, República Dominicana.</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 w-full max-w-xs mx-auto md:mx-0">
                <div className="flex items-center gap-3 mb-3">
                   <Clock size={16} className="text-gray-400" />
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Horario de Atención</p>
                </div>
                <p className="text-sm font-black text-gray-900 dark:text-white">Lunes - Sábado</p>
                <p className="text-sm text-gray-500">9:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* BARRA INFERIOR */}
        <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-8">
          
          {/* Métodos de Pago sin bordes */}
          <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {['Visa', 'Mastercard', 'PayPal', 'Popular'].map((method) => (
               <span key={method} className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 hover:text-gray-900 dark:hover:text-white transition-colors cursor-default">
                 {method}
               </span>
             ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
            <Link href="/privacidad" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-gray-900 dark:hover:text-white transition-colors">Términos</Link>
            <p>© {currentYear} SNOWCONNECT INC.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Componentes auxiliares
function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
      <span className="w-0 group-hover:w-2 h-[1px] bg-blue-600 transition-all duration-300" />
      {children}
    </Link>
  );
}

function SocialButton({ icon: Icon, href, label }: { icon: any, href: string, label?: string }) {
  return (
    <a href={href} aria-label={label} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110 shadow-sm">
      <Icon size={18} />
    </a>
  );
}