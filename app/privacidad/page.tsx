export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 md:px-12 text-foreground space-y-8">
      
      {/* Encabezado */}
      <div className="border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Política de Privacidad</h1>
        <p className="text-muted-foreground">Última actualización: Enero 2026</p>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
        <section>
          <h3 className="text-2xl font-bold mb-3">1. Introducción</h3>
          <p>
            En <strong>SnowConnect</strong> (Santiago de los Caballeros, República Dominicana), valoramos tu confianza. 
            Esta política describe cómo recopilamos, usamos y protegemos tu información personal al usar nuestra plataforma.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-3">2. Información que Recopilamos</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Datos de Identificación:</strong> Nombre, cédula (opcional para facturación), y dirección de envío.</li>
            <li><strong>Datos de Contacto:</strong> Correo electrónico y número de teléfono.</li>
            <li><strong>Datos de Transacción:</strong> Historial de compras, detalles del equipo que vendes (IMEI, estado).</li>
            <li><strong>Datos Técnicos:</strong> Dirección IP, tipo de dispositivo y navegador (para mejorar la seguridad).</li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-3">3. Uso de la Información</h3>
          <p>Utilizamos tus datos exclusivamente para:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Procesar tus pedidos y envíos en Santiago y el resto del país.</li>
            <li>Gestionar garantías y servicios de reparación.</li>
            <li>Enviarte actualizaciones de estado sobre tu "Trade-In" (Intercambio).</li>
            <li>Prevención de fraude y seguridad de la cuenta.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-3">4. Protección de Datos</h3>
          <p>
            Implementamos medidas de seguridad de nivel bancario. Las contraseñas se almacenan encriptadas (bcrypt) y 
            utilizamos autenticación de dos factores (2FA) para acciones sensibles. No compartimos tus datos con terceros 
            salvo proveedores de logística (para entregarte el paquete).
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-3">5. Tus Derechos</h3>
          <p>
            Como usuario, tienes derecho a solicitar la eliminación de tu cuenta o la corrección de tus datos en cualquier momento 
            desde tu panel de control o escribiendo a <strong>privacidad@snowconnect.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}