const fetch = require('node-fetch');

async function testCreateProduct() {
  console.log('🧪 Probando creación de producto...');
  
  const productData = {
    imei: "TEST" + Date.now(),
    marca: "Samsung",
    modelo: "Galaxy S24 Test",
    color: "Negro",
    almacenamiento: "256GB",
    ram: "8GB",
    estado: "NUEVO",
    precioCompra: 500,
    precioVenta: 750,
    descripcion: "Producto de prueba"
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const text = await response.text();
    console.log('Response:', text.substring(0, 300));
    
    if (response.ok) {
      console.log('✅ ¡Producto creado exitosamente!');
    } else {
      console.log('❌ Error al crear producto');
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testCreateProduct();
