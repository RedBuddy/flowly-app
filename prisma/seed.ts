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

  // Crear presupuestos con fechas diferentes
  const now = new Date();
  const budgetsData = [
    { name: 'Mercado', type: 'recurrent', totalAssigned: 8000, spent: 3200, daysAgo: 14 },
    { name: 'Transporte', type: 'recurrent', totalAssigned: 2500, spent: 1800, daysAgo: 13 },
    { name: 'Entretenimiento', type: 'recurrent', totalAssigned: 3000, spent: 500, daysAgo: 12 },
    { name: 'Servicios', type: 'recurrent', totalAssigned: 4500, spent: 4500, daysAgo: 11 },
    { name: 'Salud', type: 'recurrent', totalAssigned: 3500, spent: 1200, daysAgo: 10 },
    { name: 'Educación', type: 'recurrent', totalAssigned: 4000, spent: 2100, daysAgo: 9 },
    { name: 'Mascotas', type: 'recurrent', totalAssigned: 1500, spent: 700, daysAgo: 8 },
    { name: 'Hogar', type: 'recurrent', totalAssigned: 2800, spent: 900, daysAgo: 7 },
    { name: 'Suscripciones', type: 'recurrent', totalAssigned: 1200, spent: 800, daysAgo: 6 },
    { name: 'Vacaciones 2026', type: 'occasional', totalAssigned: 15000, spent: 2000, daysAgo: 5 },
    { name: 'Nueva Computadora', type: 'occasional', totalAssigned: 25000, spent: 8000, daysAgo: 4 },
    { name: 'Compra de Moto', type: 'occasional', totalAssigned: 18000, spent: 3000, daysAgo: 3 },
    { name: 'Reforma del Departamento', type: 'occasional', totalAssigned: 22000, spent: 6500, daysAgo: 2 },
    { name: 'Curso Profesional', type: 'occasional', totalAssigned: 7000, spent: 1200, daysAgo: 1 },
    { name: 'Fondo de Emergencia', type: 'occasional', totalAssigned: 30000, spent: 5000, daysAgo: 0 },
  ];

  // Calcular totales basado en los budgets
  const totalAssigned = budgetsData.reduce((sum, budget) => sum + budget.totalAssigned, 0);
  const unassignedMoney = 15000; // Dinero sin asignar
  const totalMoney = totalAssigned + unassignedMoney;

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      id: 'user_demo_001',
      name: 'Orlando',
      email: 'redbuddylm@gmail.com',
      emailVerified: true,
      fullName: 'Usuario de Demostración',
      totalMoney,
      unassignedMoney,
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

  await Promise.all(
    budgetsData.map((budget) =>
      prisma.budget.create({
        data: {
          userId: user.id,
          name: budget.name,
          type: budget.type,
          totalAssigned: budget.totalAssigned,
          spent: budget.spent,
          createdAt: new Date(now.getTime() - budget.daysAgo * 24 * 60 * 60 * 1000),
        },
      })
    )
  );

  console.log('✅ Presupuestos creados');

  // Obtener los budgets creados para agregar transacciones
  const budgets = await prisma.budget.findMany({ where: { userId: user.id } });

  // Crear transacciones para algunos budgets
  const budgetWithTransactions = budgets.slice(0, 5); // Primeros 5 budgets

  const transactions: any[] = [];
  for (const budget of budgetWithTransactions) {
    const numTransactions = Math.floor(Math.random() * 4) + 2; // 2-5 transacciones por budget

    for (let i = 0; i < numTransactions; i++) {
      transactions.push({
        budgetId: budget.id,
        userId: user.id,
        amount: Math.floor(Math.random() * 1000) + 100,
        description: `Gasto ${i + 1} en ${budget.name}`,
        type: 'expense',
        date: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      });
    }
  }

  await prisma.budgetTransaction.createMany({ data: transactions });
  console.log('✅ Transacciones creadas');

  console.log('\n🎉 Seed completado exitosamente!');
  // console.log('\n📊 Resumen:');
  // console.log(`   - 1 usuario: ${user.email}`);
  // console.log(`   - 15 presupuestos (9 recurrentes, 6 ocasionales)`);
  // console.log(`   - ${transactions.length} transacciones de prueba`);
  // console.log(`\n💰 Balance del usuario:`);
  // console.log(`   - Total: $${totalMoney.toLocaleString('es-MX')}`);
  // console.log(`   - Sin asignar: $${unassignedMoney.toLocaleString('es-MX')}`);
  // console.log(`   - Asignado: $${totalAssigned.toLocaleString('es-MX')}`);
  // console.log(`\n🔐 Credenciales de prueba:`);
  // console.log(`   Email: redbuddylm@gmail.com`);
  // console.log(`   Password: Abc123`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });