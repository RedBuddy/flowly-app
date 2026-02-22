import 'dotenv/config';
import prisma from '@/lib/prisma'
import { hashPassword } from 'better-auth/crypto'

async function main() {
  console.log('🌱 Starting seed...');

  // Limpiar datos existentes (opcional)
  await prisma.budgetTransaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.income.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      id: 'user_demo_001',
      name: 'Orlando',
      email: 'redbuddylm@gmail.com',
      emailVerified: true,
      fullName: 'Usuario de Demostración',
      totalMoney: 25000,
      unassignedMoney: 5000,
    },
  });

  console.log('✅ Usuario creado:', user.email);

  // Hash the password using better-auth's hashing function
  const hashedPassword = await hashPassword('Abc123');

  // Crear cuenta de autenticación para el usuario
  await prisma.account.create({
    data: {
      id: 'account_demo_001',
      accountId: 'redbuddylm@gmail.com',
      providerId: 'credential',
      userId: user.id,
      password: hashedPassword,
    },
  });

  console.log('✅ Cuenta de autenticación creada');

  // Crear presupuestos en una sola petición
  await prisma.budget.createMany({
    data: [
      { userId: user.id, name: 'Mercado', type: 'recurrent', totalAssigned: 8000, spent: 3200 },
      { userId: user.id, name: 'Transporte', type: 'recurrent', totalAssigned: 2500, spent: 1800 },
      { userId: user.id, name: 'Entretenimiento', type: 'recurrent', totalAssigned: 3000, spent: 500 },
      { userId: user.id, name: 'Servicios', type: 'recurrent', totalAssigned: 4500, spent: 4500 },
      { userId: user.id, name: 'Salud', type: 'recurrent', totalAssigned: 3500, spent: 1200 },
      { userId: user.id, name: 'Educación', type: 'recurrent', totalAssigned: 4000, spent: 2100 },
      { userId: user.id, name: 'Mascotas', type: 'recurrent', totalAssigned: 1500, spent: 700 },
      { userId: user.id, name: 'Hogar', type: 'recurrent', totalAssigned: 2800, spent: 900 },
      { userId: user.id, name: 'Suscripciones', type: 'recurrent', totalAssigned: 1200, spent: 800 },
      { userId: user.id, name: 'Vacaciones 2026', type: 'project', totalAssigned: 15000, spent: 2000 },
      { userId: user.id, name: 'Nueva Computadora', type: 'project', totalAssigned: 25000, spent: 8000 },
      { userId: user.id, name: 'Compra de Moto', type: 'project', totalAssigned: 18000, spent: 3000 },
      { userId: user.id, name: 'Reforma del Departamento', type: 'project', totalAssigned: 22000, spent: 6500 },
      { userId: user.id, name: 'Curso Profesional', type: 'project', totalAssigned: 7000, spent: 1200 },
      { userId: user.id, name: 'Fondo de Emergencia', type: 'project', totalAssigned: 30000, spent: 5000 },
    ],
  });

  console.log('✅ Presupuestos creados');

  console.log('🎉 Seed completado exitosamente!');
  console.log('\n📊 Resumen:');
  console.log(`   - 1 usuario: ${user.email}`);
  console.log(`   - 15 presupuestos (9 recurrentes, 6 proyectos)`);
  console.log(`\n🔐 Credenciales de prueba:`);
  console.log(`   Email: redbuddylm@gmail.com`);
  console.log(`   Password: Abc123`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });