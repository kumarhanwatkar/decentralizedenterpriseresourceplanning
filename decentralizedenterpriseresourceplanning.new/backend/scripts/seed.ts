import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected:', conn.connection.host);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed database
export const seedDatabase = async () => {
  const connection = await connectDB();

  try {
    // Clear all collections
    console.log('\n🧹 Clearing collections...');
    await Promise.all([
      connection.connection.collection('users').deleteMany({}),
      connection.connection.collection('employees').deleteMany({}),
      connection.connection.collection('resources').deleteMany({}),
      connection.connection.collection('transactions').deleteMany({}),
      connection.connection.collection('settings').deleteMany({}),
      connection.connection.collection('aiconfigs').deleteMany({}),
      connection.connection.collection('payrolls').deleteMany({}),
    ]);
    console.log('✅ All collections cleared');

    // Create Users
    console.log('\n👥 Creating users...');
    const adminUser = await connection.connection.collection('users').insertOne({
      walletAddress: '0x1234567890123456789012345678901234567890',
      email: 'admin@erp.com',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      lastLogin: new Date(),
      loginCount: 5,
      department: 'Administration',
      joinDate: new Date('2024-01-01'),
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const employeeUsers = await connection.connection.collection('users').insertMany([
      {
        walletAddress: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
        email: 'alex@company.com',
        name: 'Alex Johnson',
        role: 'employee',
        status: 'active',
        lastLogin: new Date(),
        loginCount: 20,
        department: 'Engineering',
        joinDate: new Date('2023-01-15'),
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        walletAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
        email: 'sarah@company.com',
        name: 'Sarah Chen',
        role: 'employee',
        status: 'active',
        lastLogin: new Date(),
        loginCount: 18,
        department: 'Product',
        joinDate: new Date('2023-02-10'),
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        email: 'mike@company.com',
        name: 'Mike Davis',
        role: 'employee',
        status: 'active',
        lastLogin: new Date(),
        loginCount: 15,
        department: 'Operations',
        joinDate: new Date('2023-03-20'),
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('✅ Created 1 admin + 3 employees');

    // Create Employees
    console.log('\n💼 Creating employee records...');
    const employees = await connection.connection.collection('employees').insertMany([
      {
        userId: adminUser.insertedId,
        walletAddress: '0x1234567890123456789012345678901234567890',
        employeeId: 'EMP001',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@erp.com',
        department: 'Administration',
        role: 'System Administrator',
        hourlyRate: 75,
        baseSalary: 120000,
        payrollCycle: 'monthly',
        coldWallet: '0x1111111111111111111111111111111111111111',
        hotWallet: '0x2222222222222222222222222222222222222222',
        walletType: 'metamask',
        status: 'active',
        startDate: new Date('2024-01-01'),
        endDate: null,
        totalEarned: 25000,
        totalAccrued: 0,
        liquidAmount: 25000,
        lockedAmount: 0,
        totalPaid: 25000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: employeeUsers.insertedIds[0],
        walletAddress: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
        employeeId: 'EMP002',
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@company.com',
        department: 'Engineering',
        role: 'Senior Developer',
        hourlyRate: 65,
        baseSalary: 110000,
        payrollCycle: 'monthly',
        coldWallet: '0x3333333333333333333333333333333333333333',
        hotWallet: '0x4444444444444444444444444444444444444444',
        walletType: 'metamask',
        status: 'active',
        startDate: new Date('2023-01-15'),
        endDate: null,
        totalEarned: 23450,
        totalAccrued: 0,
        liquidAmount: 23450,
        lockedAmount: 0,
        totalPaid: 23450,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: employeeUsers.insertedIds[1],
        walletAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
        employeeId: 'EMP003',
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah@company.com',
        department: 'Product',
        role: 'Product Manager',
        hourlyRate: 60,
        baseSalary: 105000,
        payrollCycle: 'monthly',
        coldWallet: '0x5555555555555555555555555555555555555555',
        hotWallet: '0x6666666666666666666666666666666666666666',
        walletType: 'metamask',
        status: 'active',
        startDate: new Date('2023-02-10'),
        endDate: null,
        totalEarned: 20500,
        totalAccrued: 0,
        liquidAmount: 20500,
        lockedAmount: 0,
        totalPaid: 20500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: employeeUsers.insertedIds[2],
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        employeeId: 'EMP004',
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike@company.com',
        department: 'Operations',
        role: 'Operations Specialist',
        hourlyRate: 50,
        baseSalary: 90000,
        payrollCycle: 'monthly',
        coldWallet: '0x7777777777777777777777777777777777777777',
        hotWallet: '0x8888888888888888888888888888888888888888',
        walletType: 'metamask',
        status: 'active',
        startDate: new Date('2023-03-20'),
        endDate: null,
        totalEarned: 19340,
        totalAccrued: 0,
        liquidAmount: 19340,
        lockedAmount: 0,
        totalPaid: 19340,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('✅ Created 4 employee records');

    // Create Resources
    console.log('\n🖥️ Creating resources...');
    await connection.connection.collection('resources').insertMany([
      {
        name: 'Server Node 1',
        type: 'server',
        department: 'Infrastructure',
        status: 'operational',
        utilization: 78,
        efficiency: 94,
        lastMaintenance: new Date('2025-01-15'),
        location: 'Data Center A',
        specs: { cpu: '32-Core', ram: '128GB', storage: '2TB SSD' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'GPU Cluster',
        type: 'machine',
        department: 'Engineering',
        status: 'operational',
        utilization: 92,
        efficiency: 89,
        lastMaintenance: new Date('2025-01-10'),
        location: 'Lab 2',
        specs: { gpus: '8x NVIDIA A100', memory: '320GB' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Load Balancer',
        type: 'equipment',
        department: 'Infrastructure',
        status: 'operational',
        utilization: 45,
        efficiency: 98,
        lastMaintenance: new Date('2025-01-20'),
        location: 'Data Center B',
        specs: { brand: 'F5', model: 'BIG-IP' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Database Server',
        type: 'server',
        department: 'Infrastructure',
        status: 'operational',
        utilization: 85,
        efficiency: 96,
        lastMaintenance: new Date('2025-01-28'),
        location: 'Data Center A',
        specs: { cpu: '64-Core', ram: '256GB', storage: '10TB SSD' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Development Workstation',
        type: 'machine',
        department: 'Engineering',
        status: 'operational',
        utilization: 65,
        efficiency: 91,
        lastMaintenance: new Date('2024-12-28'),
        location: 'Office 3',
        specs: { cpu: '16-Core', ram: '64GB', gpu: '1xRTX4090' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('✅ Created 5 resources');

    // Create Transactions
    console.log('\n💸 Creating transactions...');
    const now = new Date();
    await connection.connection.collection('transactions').insertMany([
      {
        txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
        type: 'payroll',
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
        amount: 1200,
        token: 'USDT',
        timestamp: new Date(now.getTime() - 86400000),
        status: 'confirmed',
        blockNumber: 45678900,
        gasUsed: 21000,
        gasPrice: '50',
        createdAt: new Date(now.getTime() - 86400000),
        updatedAt: new Date(now.getTime() - 86400000),
      },
      {
        txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
        type: 'payroll',
        from: '0x1234567890123456789012345678901234567890',
        to: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
        amount: 1150,
        token: 'USDT',
        timestamp: new Date(now.getTime() - 86400000),
        status: 'confirmed',
        blockNumber: 45678899,
        gasUsed: 21000,
        gasPrice: '50',
        createdAt: new Date(now.getTime() - 86400000),
        updatedAt: new Date(now.getTime() - 86400000),
      },
      {
        txHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
        type: 'yield',
        from: 'Hot Wallet',
        to: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
        amount: 450,
        token: 'USDT',
        timestamp: new Date(now.getTime() - 172800000),
        status: 'confirmed',
        blockNumber: 45678850,
        gasUsed: 21000,
        gasPrice: '50',
        createdAt: new Date(now.getTime() - 172800000),
        updatedAt: new Date(now.getTime() - 172800000),
      },
      {
        txHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
        type: 'transfer',
        from: '0x1234567890123456789012345678901234567890',
        to: 'Vendor Account',
        amount: 15000,
        token: 'USDT',
        timestamp: new Date(now.getTime() - 259200000),
        status: 'confirmed',
        blockNumber: 45678800,
        gasUsed: 21000,
        gasPrice: '50',
        createdAt: new Date(now.getTime() - 259200000),
        updatedAt: new Date(now.getTime() - 259200000),
      },
    ]);
    console.log('✅ Created 4 transactions');

    // Create Settings
    console.log('\n⚙️ Creating settings...');
    await connection.connection.collection('settings').insertOne({
      organizationId: new mongoose.Types.ObjectId(),
      companyName: 'TechForge Inc',
      companyEmail: 'info@techforge.com',
      companyPhone: '+1-555-0100',
      companyWebsite: 'https://techforge.com',
      payrollCycle: 'monthly',
      paymentMethod: 'blockchain',
      yieldDistributionPercent: 30,
      notificationEmail: true,
      notificationPayroll: true,
      notificationYield: true,
      currency: 'USDT',
      timezone: 'UTC',
      language: 'en',
      theme: 'auto',
      apiKey: 'sk_live_' + Math.random().toString(36).substring(2, 15),
      webhookUrl: 'https://example.com/webhooks',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Created settings');

    // Create AI Config
    console.log('\n🤖 Creating AI config...');
    await connection.connection.collection('aiconfigs').insertOne({
      organizationId: new mongoose.Types.ObjectId(),
      name: 'Executive Dashboard',
      description: 'AI-generated dashboard for executive overview',
      rawInput: 'Create an executive dashboard showing payroll trends, resource utilization, and transaction summary',
      status: 'published',
      isActive: true,
      widgets: [
        {
          id: 'w1',
          type: 'stat_card',
          title: 'Total Employees',
          position: { row: 0, col: 0 },
          size: { width: 2, height: 1 },
          dataSource: 'employees',
          configuration: { metric: 'count', color: 'blue' },
        },
        {
          id: 'w2',
          type: 'stat_card',
          title: 'Total Payroll (Monthly)',
          position: { row: 0, col: 2 },
          size: { width: 2, height: 1 },
          dataSource: 'payroll',
          configuration: { metric: 'total', color: 'green' },
        },
        {
          id: 'w3',
          type: 'chart',
          title: 'Resource Utilization',
          position: { row: 1, col: 0 },
          size: { width: 4, height: 2 },
          dataSource: 'resources',
          configuration: { chartType: 'bar', metric: 'utilization' },
        },
        {
          id: 'w4',
          type: 'table',
          title: 'Recent Transactions',
          position: { row: 3, col: 0 },
          size: { width: 4, height: 2 },
          dataSource: 'transactions',
          configuration: { limit: 10, sortBy: 'timestamp' },
        },
      ],
      layout: 'grid',
      gridColumns: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Created AI config');

    console.log('\n✅ ✅ ✅ Database seeding completed successfully! ✅ ✅ ✅\n');
    
    // Print summary
    console.log('📊 SEEDED DATA SUMMARY:');
    console.log('  • 1 Admin User');
    console.log('  • 3 Employee Users');
    console.log('  • 4 Employee Records');
    console.log('  • 5 Resources');
    console.log('  • 4 Transactions');
    console.log('  • 1 Organization Settings');
    console.log('  • 1 AI Configuration\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run if this is the main module
if (require.main === module) {
  seedDatabase();
}
