import { ShieldCheck, Truck, RefreshCw } from "lucide-react";

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 md:px-12 text-foreground space-y-12">
      
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Términos del Servicio</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Claridad y transparencia. Aquí definimos las reglas del juego para asegurar una experiencia justa para todos.
        </p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-2xl">
            <ShieldCheck className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Garantía de 30 Días</h3>
            <p className="text-sm text-muted-foreground">Cubre defectos de fábrica. No cubre daños por agua o caídas.</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl">
            <Truck className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Envíos Seguros</h3>
            <p className="text-sm text-muted-foreground">Entregas en Santiago (24h) y Nacionales (48-72h).</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl">
            <RefreshCw className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Política de Retorno</h3>
            <p className="text-sm text-muted-foreground">7 días para cambios si el equipo no cumple con la descripción.</p>
        </div>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
        <section>
          <h3 className="text-2xl font-bold">1. Aceptación de Términos</h3>
          <p>
            Al comprar o vender en SnowConnect, aceptas estos términos. Nos reservamos el derecho de rechazar servicio a cuentas 
            con actividad sospechosa o fraudulenta.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold">2. Garantía Snow™ (Detalles)</h3>
          <p>Todos nuestros equipos seminuevos pasan por una verificación de 40 puntos. La garantía cubre:</p>
          <ul className="list-disc pl-5">
            <li>Fallas en la placa base, cámaras, micrófonos y bocinas.</li>
            <li>Problemas de carga no relacionados con suciedad en el puerto.</li>
            <li>Defectos de pantalla (touch) sin fracturas visibles.</li>
          </ul>
          <p className="font-bold mt-2 text-red-500">La garantía se anula si:</p>
          <ul className="list-disc pl-5">
            <li>El equipo presenta golpes, humedad o ha sido abierto por terceros.</li>
            <li>El sello de garantía SnowConnect ha sido removido.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-bold">3. Venta e Intercambio (Trade-In)</h3>
          <p>
            Al vendernos tu equipo, declaras ser el propietario legítimo. Todos los equipos son verificados en bases de datos 
            de robo. Si un equipo es reportado, será entregado a las autoridades locales conforme a la ley dominicana.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold">4. Pagos y Precios</h3>
          <p>
            Los precios están expresados en Pesos Dominicanos (DOP). Aceptamos transferencias y efectivo contra entrega (solo en Santiago).
            SnowConnect se reserva el derecho de corregir errores tipográficos en los precios.
          </p>
        </section>
      </div>

    </div>
  );
}