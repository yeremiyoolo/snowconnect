"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Clock, Mail, MapPin } from "lucide-react";

// Icono de TikTok
const TikTokIcon = ({ size = 18, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border pt-24 pb-12 relative overflow-hidden">
      
      {/* Elemento decorativo */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20 text-center md:text-left">
          
          {/* MARCA */}
          <div className="lg:col-span-4 space-y-8 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-white shadow-sm border border-border">
                <div className="w-full h-full flex items-center justify-center p-2">
                   <Image src="/logo.png" alt="SnowConnect" width={48} height={48} className="object-contain" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground uppercase leading-none">
                Snow<span className="text-blue-600">Connect</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-sm">
              Tu destino premium para tecnología en Santiago. 
              Compra, vende y repara con confianza y garantía real.
            </p>
            
            <div className="flex items-center gap-4">
              <SocialButton icon={Instagram} href="#" label="Instagram" />
              <SocialButton icon={Facebook} href="#" label="Facebook" />
              <SocialButton icon={TikTokIcon} href="#" label="TikTok" />
              <SocialButton icon={Mail} href="mailto:contacto@snowconnect.com" label="Correo" />
            </div>
          </div>

          {/* TIENDA */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8">Tienda</h4>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
              <li><FooterLink href="/catalogo">Inventario</FooterLink></li>
              <li><FooterLink href="/catalogo?marca=Apple">iPhone</FooterLink></li>
              <li><FooterLink href="/catalogo?marca=Samsung">Samsung</FooterLink></li>
              <li><FooterLink href="/catalogo?oferta=true">Liquidación</FooterLink></li>
            </ul>
          </div>

          {/* SOPORTE */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8">Soporte</h4>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
              <li><FooterLink href="/account/orders">Mis Pedidos</FooterLink></li>
              <li><FooterLink href="/terminos">Garantía Snow™</FooterLink></li>
              <li><FooterLink href="/servicios">Vender mi Equipo</FooterLink></li>
              <li><FooterLink href="/dejar-review">Dejar Reseña</FooterLink></li>
            </ul>
          </div>

          {/* UBICACIÓN */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8">Contacto</h4>
            <div className="space-y-6 w-full">
              <div className="flex items-start gap-4 text-sm font-bold text-muted-foreground justify-center md:justify-start">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                   <MapPin size={20} />
                </div>
                <div>
                   <p className="text-foreground mb-1">Santiago de los Caballeros</p>
                   <p className="text-xs font-medium">Tienda 100% Online con entregas personales.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-sm font-bold text-muted-foreground justify-center md:justify-start">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                   <Clock size={20} />
                </div>
                <div>
                   <p className="text-foreground mb-1">Lunes - Sábado</p>
                   <p className="text-xs font-medium">9:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-12 border-t border-border flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {['Visa', 'Mastercard', 'PayPal', 'Popular'].map((method) => (
               <span key={method} className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1 cursor-default">
                 {method}
               </span>
             ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
            <Link href="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-foreground transition-colors">Términos</Link>
            <p>© {currentYear} SnowConnect RD.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-blue-600 transition-colors flex items-center gap-2 group justify-center md:justify-start">
      <span className="w-0 group-hover:w-2 h-[1px] bg-blue-600 transition-all duration-300 hidden md:block" />
      {children}
    </Link>
  );
}

function SocialButton({ icon: Icon, href, label }: { icon: any, href: string, label?: string }) {
  return (
    <a href={href} aria-label={label} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110">
      <Icon size={18} />
    </a>
  );
}