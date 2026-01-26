import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud Recibida!</h2>
        <p className="text-gray-500 mb-8">
          Hemos recibido las fotos y datos de tu equipo. Nuestro equipo las revisará y te contactará por WhatsApp en menos de 2 horas con una oferta.
        </p>
        <Link href="/" className="block w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}