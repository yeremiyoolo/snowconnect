import { prisma } from '@/lib/prisma'; // <--- CORREGIDO
import Image from 'next/image';

export default async function AdminQuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Solicitudes de Cotización ({quotes.length})</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                quote.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {quote.status}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(quote.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-bold text-lg">{quote.brand} {quote.model}</h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Almacenamiento:</span> {quote.storage}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Condición:</span> {quote.condition}
              </p>
              
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {quote.images.map((img, i) => (
                  <a key={i} href={img} target="_blank" rel="noreferrer" className="relative w-12 h-12 flex-shrink-0 border rounded overflow-hidden">
                    <Image src={img} alt="Evidence" fill className="object-cover" />
                  </a>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t text-sm bg-gray-50 -mx-4 -mb-4 p-4">
                <p><strong>Cliente:</strong> {quote.customerName}</p>
                <p><strong>WhatsApp:</strong> {quote.customerPhone}</p>
                <p className="text-gray-500 mt-1 italic">"{quote.details || 'Sin detalles'}"</p>
                
                <a 
                  href={`https://wa.me/${quote.customerPhone.replace(/[^0-9]/g, '')}?text=Hola ${quote.customerName}, vimos tu ${quote.model}...`}
                  target="_blank"
                  className="mt-3 block text-center bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}