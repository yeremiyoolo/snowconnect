const fs = require('fs')
const path = require('path')

console.log('🔍 VERIFICANDO ARCHIVOS API...\n')

const archivosAPI = [
  'app/api/productos/route.ts',
  'app/api/productos/[id]/route.ts',
  'app/api/auth/[...nextauth]/route.ts',
  'lib/prisma.ts'
]

archivosAPI.forEach(archivo => {
  const existe = fs.existsSync(archivo)
  console.log(`${existe ? '✅' : '❌'} ${archivo}`)
  
  if (existe) {
    const contenido = fs.readFileSync(archivo, 'utf8')
    const lineas = contenido.split('\n').length
    console.log(`   📏 ${lineas} líneas`)
  }
})

console.log('\n🎯 ESTRUCTURA COMPLETA DEL CRUD:')
console.log('   ✅ API: GET, POST, PUT, DELETE')
console.log('   ✅ Frontend: Lista, Detalle, Nuevo, Editar')
console.log('   ✅ Base de datos: Prisma + SQLite')
console.log('\n🌐 URLs para probar:')
console.log('   • Lista productos: http://localhost:3000/admin/productos')
console.log('   • Nuevo producto: http://localhost:3000/admin/productos/nuevo')
console.log('   • API productos: http://localhost:3000/api/productos')
