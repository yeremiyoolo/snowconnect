import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Creando usuario administrador...')
  
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })
  
  console.log('✅ Usuario admin creado:')
  console.log('   Email: admin@test.com')
  console.log('   Contraseña: admin123')
  console.log('   ⚠️ CAMBIA ESTAS CREDENCIALES EN PRODUCCIÓN')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
