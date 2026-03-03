import 'dotenv/config';
import prisma from '@/lib/prisma'
import { hashPassword } from 'better-auth/crypto'

async function main() {
  console.log('🌱 Starting seed...');

  // Limpiar datos existentes (opcional)
  await prisma.budgetTransaction.deleteMany();
  await prisma.goalContribution.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.debtPayment.deleteMany();
  await prisma.debt.deleteMany();
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

  // Crear metas (Goals)
  const goalsData = [
    { name: 'Fondo de Emergencia', target: 50000, current: 18500, deadline: '2026-12-31' },
    { name: 'Viaje a Europa', target: 25000, current: 8200, deadline: '2026-06-30' },
    { name: 'Nuevo Auto', target: 80000, current: 32500, deadline: '2026-09-30' },
    { name: 'Casa Propia', target: 250000, current: 65000, deadline: '2028-12-31' },
    { name: 'Educación Profesional', target: 15000, current: 5800, deadline: '2026-08-31' },
  ];

  const goals = await Promise.all(
    goalsData.map((goal) =>
      prisma.goal.create({
        data: {
          userId: user.id,
          name: goal.name,
          target: goal.target,
          current: goal.current,
          deadline: new Date(goal.deadline),
          createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      })
    )
  );

  console.log('✅ Metas creadas');

  // Crear contribuciones a metas
  const goalContributions: any[] = [];
  for (const goal of goals) {
    const numContributions = Math.floor(Math.random() * 4) + 2; // 2-5 contribuciones

    for (let i = 0; i < numContributions; i++) {
      goalContributions.push({
        goalId: goal.id,
        userId: user.id,
        amount: Math.floor(Math.random() * 3000) + 500,
        description: `Contribución a ${goal.name}`,
        date: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }
  }

  if (goalContributions.length > 0) {
    await prisma.goalContribution.createMany({ data: goalContributions });
    console.log('✅ Contribuciones a metas creadas');
  }

  // Crear deudas (Debts)
  const debtsData = [
    { name: 'Tarjeta de Crédito BBVA', totalDebt: 15000, dueDate: '2026-03-15', priority: 'high' },
    { name: 'Préstamo Personal Banco Azteca', totalDebt: 45000, dueDate: '2026-05-30', priority: 'high' },
    { name: 'Deuda con Amigo', totalDebt: 3500, dueDate: '2026-04-10', priority: 'medium' },
    { name: 'Tarjeta Ripley', totalDebt: 8200, dueDate: '2026-06-15', priority: 'medium' },
    { name: 'Crédito para Moto', totalDebt: 55000, dueDate: '2027-12-31', priority: 'low' },
  ];

  const debts = await Promise.all(
    debtsData.map((debt) =>
      prisma.debt.create({
        data: {
          userId: user.id,
          name: debt.name,
          totalDebt: debt.totalDebt,
          remaining: debt.totalDebt * 0.7, // 70% del total remaining
          minimumPayment: debt.totalDebt * 0.1, // 10% como pago mínimo
          dueDate: new Date(debt.dueDate),
          priority: debt.priority as 'low' | 'medium' | 'high',
          createdAt: new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        },
      })
    )
  );

  console.log('✅ Deudas creadas');

  // Crear pagos a deudas
  const debtPayments: any[] = [];
  for (const debt of debts) {
    const numPayments = Math.floor(Math.random() * 3) + 1; // 1-3 pagos

    for (let i = 0; i < numPayments; i++) {
      debtPayments.push({
        debtId: debt.id,
        userId: user.id,
        amount: Math.floor((debt.minimumPayment * (Math.random() * 0.6 + 0.7))), // Variación entre 42-84% de cuota mínima
        description: `Pago ${i + 1} a ${debt.name}`,
        date: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }
  }

  if (debtPayments.length > 0) {
    await prisma.debtPayment.createMany({ data: debtPayments });
    console.log('✅ Pagos de deudas creados');
  }

  // Crear ingresos (Income)
  const incomesData = [
    { description: 'Salario Mensual', amount: 48000, daysAgo: 5 },
    { description: 'Bonificación por Desempeño', amount: 8000, daysAgo: 15 },
    { description: 'Freelance - Desarrollo Web', amount: 5200, daysAgo: 8 },
    { description: 'Venta de Artículos Usados', amount: 2500, daysAgo: 12 },
    { description: 'Consultoría Independiente', amount: 7500, daysAgo: 3 },
    { description: 'Intereses Generados', amount: 450, daysAgo: 20 },
    { description: 'Regalo de Familia', amount: 3000, daysAgo: 25 },
    { description: 'Reembolso de Seguro', amount: 1800, daysAgo: 10 },
  ];

  const incomes = await Promise.all(
    incomesData.map((income) =>
      prisma.income.create({
        data: {
          userId: user.id,
          description: income.description,
          amount: income.amount,
          date: new Date(now.getTime() - income.daysAgo * 24 * 60 * 60 * 1000),
          createdAt: new Date(now.getTime() - income.daysAgo * 24 * 60 * 60 * 1000),
        },
      })
    )
  );

  console.log('✅ Ingresos creados');

  // Crear alertas (Alerts)
  const alertsData = [
    { type: 'debt', title: 'Pago próximo', message: 'BBVA: Pago vence en 7 días por $15,000' },
    { type: 'budget', title: 'Presupuesto bajo', message: 'Mercado: Has utilizado el 75% del presupuesto asignado' },
    { type: 'goal', title: 'Meta alcanzada', message: 'Viaje a Europa: Completaste tu contribución mensual' },
    { type: 'debt', title: 'Deuda próxima a vencer', message: 'Crédito Personal: Última cuota vence en 45 días' },
    { type: 'budget', title: 'Presupuesto agotado', message: 'Servicios: Has alcanzado el 100% de tu presupuesto' },
    { type: 'goal', title: 'Progreso de meta', message: 'Fondo de Emergencia: 37% completado (18.5K/50K)' },
  ];

  const alerts = await Promise.all(
    alertsData.map((alert, index) =>
      prisma.alert.create({
        data: {
          userId: user.id,
          type: alert.type as 'debt' | 'budget' | 'goal',
          title: alert.title,
          message: alert.message,
          isRead: index > 2, // Primeras 3 sin leer, resto leídas
          createdAt: new Date(now.getTime() - (6 - index) * 24 * 60 * 60 * 1000),
        },
      })
    )
  );

  console.log('✅ Alertas creadas');

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📊 Resumen:');
  console.log(`   - 1 usuario: ${user.email}`);
  console.log(`   - 15 presupuestos (9 recurrentes, 6 ocasionales)`);
  console.log(`   - ${transactions.length} transacciones de presupuestos`);
  console.log(`   - ${goals.length} metas financieras`);
  console.log(`   - ${goalContributions.length} contribuciones a metas`);
  console.log(`   - ${debts.length} deudas registradas`);
  console.log(`   - ${debtPayments.length} pagos de deudas`);
  console.log(`   - ${incomes.length} registros de ingresos`);
  console.log(`   - ${alerts.length} alertas del sistema`);
  console.log(`\n💰 Balance del usuario:`);
  console.log(`   - Total: $${totalMoney.toLocaleString('es-MX')}`);
  console.log(`   - Sin asignar: $${unassignedMoney.toLocaleString('es-MX')}`);
  console.log(`   - Asignado: $${totalAssigned.toLocaleString('es-MX')}`);
  console.log(`\n🔐 Credenciales de prueba:`);
  console.log(`   Email: redbuddylm@gmail.com`);
  console.log(`   Contraseña: Abc123`);
  console.log(`\n✨ Puedes probar todas las funcionalidades:`);
  console.log(`   ✓ Presupuestos: crear, editar, eliminar, gastar, asignar`);
  console.log(`   ✓ Metas: crear, contribuir, ver progreso`);
  console.log(`   ✓ Deudas: crear, registrar pagos, establecer prioridades`);
  console.log(`   ✓ Ingresos: registrar, editar, eliminar`);
  console.log(`   ✓ Alertas: ver, marcar como leída, eliminar`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });