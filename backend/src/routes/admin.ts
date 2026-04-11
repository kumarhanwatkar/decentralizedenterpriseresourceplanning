import { Router, Request, Response } from 'express';

const router = Router();

/**
 * ADMIN ONLY: Health check
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'Admin API OK',
    timestamp: new Date().toISOString(),
  });
});

/**
 * ADMIN ONLY: Seed database with example data
 * Requires X-SEED-KEY header
 */
router.post('/seed', async (req: Request, res: Response) => {
  try {
    const seedKey = req.headers['x-seed-key'];
    const expectedKey = process.env.SEED_KEY || 'seed_secret_key_12345';
    
    // Verify seed key
    if (seedKey !== expectedKey) {
      console.warn('⚠️ Unauthorized seed attempt with key:', seedKey);
      return res.status(401).json({ error: 'Unauthorized - Invalid seed key' });
    }

    console.log('🌱 Starting database seed...');

    // Dynamic imports to avoid circular dependencies
    const { default: User } = await import('../models/User');
    const { default: Employee } = await import('../models/Employee');
    const { default: Resource } = await import('../models/Resource');
    const { default: Settings } = await import('../models/Settings');

    // Clear collections - delete all documents
    console.log('🧹 Clearing existing data...');
    const userDeleteResult = await User.deleteMany({});
    console.log(`  - Deleted ${userDeleteResult.deletedCount} users`);
    
    const employeeDeleteResult = await Employee.deleteMany({});
    console.log(`  - Deleted ${employeeDeleteResult.deletedCount} employees`);
    
    const resourceDeleteResult = await Resource.deleteMany({});
    console.log(`  - Deleted ${resourceDeleteResult.deletedCount} resources`);
    
    const settingsDeleteResult = await Settings.deleteMany({});
    console.log(`  - Deleted ${settingsDeleteResult.deletedCount} settings`);

    // Create admin user with explicit error handling
    let adminUser;
    try {
      adminUser = await User.create({
        walletAddress: '0x1234567890123456789012345678901234567890',
        email: 'admin@erp.com',
        name: 'Admin User',
        role: 'admin',
        status: 'active',
        department: 'Administration',
        joinDate: new Date('2024-01-01'),
      });
      console.log('✅ Created admin user');
    } catch (err) {
      console.error('Error creating admin user:', err);
      throw err;
    }

    // Create employee users with explicit error handling
    const employeeUsersData = [
      {
        walletAddress: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
        email: 'alex@company.com',
        name: 'Alex Johnson',
        role: 'employee',
        department: 'Engineering',
        joinDate: new Date('2023-01-15'),
      },
      {
        walletAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
        email: 'sarah@company.com',
        name: 'Sarah Chen',
        role: 'employee',
        department: 'Product',
        joinDate: new Date('2023-02-10'),
      },
      {
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        email: 'mike@company.com',
        name: 'Mike Davis',
        role: 'employee',
        department: 'Operations',
        joinDate: new Date('2023-03-20'),
      },
    ];

    let employeeUsers;
    try {
      employeeUsers = await User.insertMany(employeeUsersData, { ordered: false });
      console.log(`✅ Created ${employeeUsers.length} employee users`);
    } catch (err) {
      console.error('Error creating employee users:', err);
      throw err;
    }

    // Create employees
    const employeesData = [
      {
        userId: adminUser._id,
        walletAddress: '0x1234567890123456789012345678901234567890',
        employeeId: 'EMP001',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@erp.com',
        department: 'Administration',
        role: 'System Administrator',
        hourlyRate: 75,
        baseSalary: 120000,
        coldWallet: '0x1111111111111111111111111111111111111111',
        hotWallet: '0x2222222222222222222222222222222222222222',
        status: 'active',
        startDate: new Date('2024-01-01'),
        totalEarned: 25000,
        liquidAmount: 25000,
        totalPaid: 25000,
      },
      {
        userId: employeeUsers[0]._id,
        walletAddress: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
        employeeId: 'EMP002',
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@company.com',
        department: 'Engineering',
        role: 'Senior Developer',
        hourlyRate: 65,
        baseSalary: 110000,
        coldWallet: '0x3333333333333333333333333333333333333333',
        hotWallet: '0x4444444444444444444444444444444444444444',
        status: 'active',
        startDate: new Date('2023-01-15'),
        totalEarned: 23450,
        liquidAmount: 23450,
        totalPaid: 23450,
      },
      {
        userId: employeeUsers[1]._id,
        walletAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
        employeeId: 'EMP003',
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah@company.com',
        department: 'Product',
        role: 'Product Manager',
        hourlyRate: 60,
        baseSalary: 105000,
        coldWallet: '0x5555555555555555555555555555555555555555',
        hotWallet: '0x6666666666666666666666666666666666666666',
        status: 'active',
        startDate: new Date('2023-02-10'),
        totalEarned: 20500,
        liquidAmount: 20500,
        totalPaid: 20500,
      },
      {
        userId: employeeUsers[2]._id,
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        employeeId: 'EMP004',
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike@company.com',
        department: 'Operations',
        role: 'Operations Specialist',
        hourlyRate: 50,
        baseSalary: 90000,
        coldWallet: '0x7777777777777777777777777777777777777777',
        hotWallet: '0x8888888888888888888888888888888888888888',
        status: 'active',
        startDate: new Date('2023-03-20'),
        totalEarned: 19340,
        liquidAmount: 19340,
        totalPaid: 19340,
      },
    ];

    let createdEmployees;
    try {
      createdEmployees = await Employee.insertMany(employeesData, { ordered: false });
      console.log(`✅ Created ${createdEmployees.length} employee records`);
    } catch (err) {
      console.error('Error creating employees:', err);
      throw err;
    }

    // Create resources
    const resourcesData = [
      {
        name: 'Server Node 1',
        type: 'server',
        department: 'Infrastructure',
        status: 'operational',
        utilization: 78,
        efficiency: 94,
        lastMaintenance: new Date('2025-01-15'),
        location: 'Data Center A',
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
      },
    ];

    let createdResources;
    try {
      createdResources = await Resource.insertMany(resourcesData, { ordered: false });
      console.log(`✅ Created ${createdResources.length} resources`);
    } catch (err) {
      console.error('Error creating resources:', err);
      throw err;
    }

    // Create settings
    let settingsCreated;
    try {
      settingsCreated = await Settings.create({
        companyName: 'TechForge Inc',
        companyEmail: 'info@techforge.com',
        companyPhone: '+1-555-0100',
        payrollCycle: 'monthly',
        yieldDistributionPercent: 30,
        notificationEmail: true,
        notificationPayroll: true,
        notificationYield: true,
      });
      console.log('✅ Created settings');
    } catch (err) {
      console.error('Error creating settings:', err);
      throw err;
    }

    console.log('\n✅ ✅ ✅ Database seeded successfully! ✅ ✅ ✅\n');

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        admins: 1,
        employees: createdEmployees?.length || 4,
        resources: createdResources?.length || 5,
        settings: 1,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({
      error: 'Seeding failed',
      message: (error as Error).message,
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
    });
  }
});

export default router;
