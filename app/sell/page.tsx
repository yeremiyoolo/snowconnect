'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { submitQuote } from '@/app/actions/submit-quote';
import Image from 'next/image';
import { 
  Loader2, 
  Smartphone, 
  HardDrive, 
  Activity, 
  User, 
  Mail, 
  Phone, 
  FileText,
  ChevronRight,
  Camera
} from 'lucide-react';

export default function SellPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await submitQuote(formData);
    
    if (result.success) {
      router.push('/account/trade-in'); 
    } else {
      alert("Hubo un error al enviar la cotización. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    // FONDO: Gris claro en Light / Negro puro en Dark
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black py-24 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            Trade-In
          </h1>
          <p className="text-lg text-gray-500 dark:text-zinc-400 font-medium max-w-xl mx-auto">
            Recibe una oferta justa por tu equipo actual y úsalo para comprar el que realmente quieres.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          
          {/* Tarjeta 1: Detalles del Dispositivo */}
          {/* TARJETAS: Blanco en Light / Gris iOS (#1C1C1E) en Dark */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden transition-colors">
            <div className="bg-gray-50/50 dark:bg-white/5 px-8 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm">1</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tu Dispositivo</h3>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Marca */}
              <div className="relative group">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-1.5 block ml-1">Marca</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
                  <select name="brand" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#2C2C2E] border-transparent rounded-2xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-gray-200 dark:focus:border-white/20 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all font-semibold appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-[#3A3A3C]">
                    <option value="Apple">Apple iPhone</option>
                    <option value="Samsung">Samsung Galaxy</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Google">Google Pixel</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={16} />
                </div>
              </div>

              {/* Modelo */}
              <div className="relative group">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-1.5 block ml-1">Modelo</label>
                <div className="relative">
                  <input type="text" name="model" placeholder="Ej: 14 Pro Max" required 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#2C2C2E] border-transparent rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-black focus:border-gray-200 dark:focus:border-white/20 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all font-semibold" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs border border-gray-300 dark:border-zinc-600 rounded px-1">M</div>
                </div>
              </div>

              {/* Almacenamiento */}
              <div className="relative group">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-1.5 block ml-1">Capacidad</label>
                <div className="relative">
                  <HardDrive className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
                  <select name="storage" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#2C2C2E] border-transparent rounded-2xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-gray-200 dark:focus:border-white/20 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all font-semibold appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-[#3A3A3C]">
                    <option value="64GB">64 GB</option>
                    <option value="128GB">128 GB</option>
                    <option value="256GB">256 GB</option>
                    <option value="512GB">512 GB</option>
                    <option value="1TB">1 TB</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={16} />
                </div>
              </div>

              {/* Estado */}
              <div className="relative group">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-1.5 block ml-1">Condición</label>
                <div className="relative">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
                  <select name="condition" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#2C2C2E] border-transparent rounded-2xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-gray-200 dark:focus:border-white/20 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all font-semibold appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-[#3A3A3C]">
                    <option value="Como Nuevo">🌟 Como Nuevo (Impecable)</option>
                    <option value="Bueno">✅ Bueno (Uso normal)</option>
                    <option value="Regular">⚠️ Regular (Detalles visibles)</option>
                    <option value="Dañado">❌ Dañado (Roto/Fallas)</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Evidencia Fotográfica */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden transition-colors">
            <div className="bg-gray-50/50 dark:bg-white/5 px-8 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm">2</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fotos del Equipo</h3>
            </div>

            <div className="p-8">
              <div className="relative group w-full">
                <input 
                  type="file" 
                  name="images" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageChange}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                />
                <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-3xl h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#2C2C2E] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:border-blue-200 dark:group-hover:border-blue-500/50 transition-all duration-300">
                  <div className="w-14 h-14 bg-white dark:bg-zinc-700 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="text-gray-400 dark:text-zinc-300 group-hover:text-blue-500 dark:group-hover:text-blue-400" size={28} />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Toca para subir fotos</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Frente, Espalda y Costados</p>
                </div>
              </div>

              {/* Grid de Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-6 animate-in fade-in slide-in-from-bottom-2">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm group">
                      <Image src={src} alt="Preview" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta 3: Información de Contacto */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden transition-colors">
            <div className="bg-gray-50/50 dark:bg-white/5 px-8 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm">3</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tus Datos</h3>
            </div>

            <div className="p-8 space-y-5">
              <div className="relative group">
                <User className="absolute left-4 top-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
                <input type="text" name="name" placeholder="Nombre Completo" defaultValue={session?.user?.name || ''} required 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#2C2C2E] border-transparent rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-black focus:border-gray-200 dark:focus:border-white/20 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all font-semibold" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative group">
                  <Phone className="absolute left-4 top-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
                  <input type="tel" name="phone" placeholder="WhatsApp" required 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#2C2C2E] border-transparent rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-black focus:border-gray-200 dark:focus:border-white/20 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all font-semibold" />
                </div>
                
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
                  <input type="email" name="email" placeholder="Correo Electrónico" defaultValue={session?.user?.email || ''} required 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#2C2C2E] border-transparent rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-black focus:border-gray-200 dark:focus:border-white/20 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all font-semibold" />
                </div>
              </div>

              <div className="relative group">
                <FileText className="absolute left-4 top-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
                <textarea name="details" placeholder="¿Algún detalle extra? (Batería cambiada, FaceID no funciona, etc)..." 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#2C2C2E] border-transparent rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-black focus:border-gray-200 dark:focus:border-white/20 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all font-semibold h-32 resize-none leading-relaxed"></textarea>
              </div>
            </div>
          </div>

          {/* Botón de Acción */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full bg-black dark:bg-white hover:bg-gray-900 dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-lg py-5 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none" />
              <span className="relative flex items-center justify-center gap-3">
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" /> Analizando solicitud...
                    </>
                ) : (
                    <>
                        Solicitar Cotización <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </span>
            </button>
            <p className="text-center text-xs text-gray-400 dark:text-zinc-500 mt-4 font-medium">
              Al enviar, aceptas nuestros términos de evaluación de equipos usados.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}