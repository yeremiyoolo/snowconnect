const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🔍 Probando conexión a /api/productos...');
    
    const response = await fetch('http://localhost:3000/api/productos', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (!response.ok) {
      const text = await response.text();
      console.log('Error response:', text.substring(0, 200));
    } else {
      const data = await response.json();
      console.log('✅ API funciona. Respuesta:', data);
    }
  } catch (error) {
    console.error('❌ Error conectando a API:', error.message);
  }
}

testAPI();
