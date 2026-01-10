"use client"

import { Upload, X, Loader2 } from "lucide-react"
import { useState } from "react"

interface UploadFotosProps {
  value: string[]
  onChange: (fotos: string[]) => void
}

// CORRECCIÓN: Usamos "export function" (sin default) para que el import { UploadFotos } funcione
export function UploadFotos({ value = [], onChange }: UploadFotosProps) {
  const [procesando, setProcesando] = useState(false)

  // Función para comprimir imagen
  const comprimirImagen = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 800 // Reducimos a 800px máximo
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          
          // Convertir a JPEG calidad 70% (Mucho más ligero)
          resolve(canvas.toDataURL('image/jpeg', 0.7))
        }
      }
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setProcesando(true)
    
    // Procesar todas las fotos
    const promesas = Array.from(files).map(file => comprimirImagen(file))
    const nuevasFotos = await Promise.all(promesas)
    
    // Combinar y limitar a 5
    const listaFinal = [...value, ...nuevasFotos].slice(0, 5)
    
    onChange(listaFinal)
    setProcesando(false)
    
    // Limpiar input para permitir subir la misma foto si se borró
    e.target.value = '' 
  }

  const eliminarFoto = (index: number) => {
    const updatedFotos = value.filter((_, i) => i !== index)
    onChange(updatedFotos)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        📸 Fotos del teléfono (máx. 5)
      </label>
      
      {/* Mostrar fotos seleccionadas */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {value.map((foto, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={foto}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border bg-gray-50"
              />
              <button
                type="button"
                onClick={() => eliminarFoto(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Botón para subir */}
      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-colors ${procesando ? 'bg-gray-100 opacity-50 cursor-wait' : 'hover:border-blue-500 hover:bg-blue-50 bg-white'}`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {procesando ? (
            <>
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-gray-500">Comprimiendo...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 text-center px-2">
                Haz clic o arrastra fotos aquí
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG</p>
            </>
          )}
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          disabled={procesando}
          onChange={handleFileChange}
        />
      </label>
      
      <p className="text-xs text-gray-500 mt-2 text-right">
        {value.length}/5 fotos
      </p>
    </div>
  )
}