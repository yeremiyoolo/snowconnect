"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { updateUserProfile } from "@/app/actions/user-profile";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  user: {
    name: string | null;
    email: string | null;
    telefono: string | null;
    image: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(user.image);
  const router = useRouter();

  // Función para mostrar la foto apenas la seleccionas
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await updateUserProfile(formData);
    setLoading(false);

    if (result.success) {
      // Forzar refresco para actualizar la foto en el Navbar
      router.refresh(); 
    } else {
      alert("Error al guardar los cambios");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <form action={handleSubmit} className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* INPUT DE IMAGEN (Oculto pero funcional) */}
        <div className="relative group mx-auto md:mx-0">
          <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden relative flex items-center justify-center">
            {preview ? (
              <Image 
                src={preview} 
                alt="Avatar" 
                fill 
                className="object-cover" 
              />
            ) : (
              <span className="text-4xl font-bold text-gray-300">
                {user.name?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          
          {/* Botón de Cámara (Clickable) */}
          <label 
            htmlFor="avatar-upload" 
            className="absolute bottom-1 right-1 bg-black text-white p-2.5 rounded-full hover:scale-110 transition-transform shadow-md cursor-pointer hover:bg-gray-800"
          >
            <Camera size={16} />
            <input 
              id="avatar-upload"
              name="image" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* CAMPOS DE TEXTO */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre Completo</label>
            <input 
              name="name"
              type="text" 
              defaultValue={user.name || ''} 
              className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-0 transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              defaultValue={user.email || ''} 
              disabled
              className="w-full p-3 bg-gray-100/50 text-gray-400 border-transparent rounded-xl cursor-not-allowed font-medium"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Teléfono (WhatsApp)</label>
            <input 
              name="phone"
              type="tel" 
              defaultValue={user.telefono || ''} 
              placeholder="Ej: 829-000-0000"
              className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-0 transition-all font-medium"
            />
          </div>
          
          <div className="md:col-span-2 flex justify-end mt-2">
            <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto px-8 bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}