import { Router, Request, Response } from 'express';
import { Employee, User, Resource, Settings } from '../models/index';

const router = Router();

/**
 * ADMIN ONLY: Seed database with example data
 * Requires SEED_KEY environment variable
 */
router.post('/seed', async (req: Request, res: Response) => {
  try {
    const seedKey = req.headers['x-seed-key'];
    const expectedKey = process.env.SEED_KEY || 'seed_secret_key_12345';
    
    if (seedKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Clear collections
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Resource.deleteMany({}),
      Settings.deleteMany({}),
    ]);

    // Create admin user
    const adminUser = new User({
      walletAddress: '0x1234567890123456789012345678901234567890',
      email: 'admin@erp.com',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      department: 'Administration',
      joinDate: new Date('2024-01-01'),
    });
    await adminUser.save();

    // Create employee users
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

    const employeeUsers: any[] = [];
    for (const userData of employeeUsersData) {
      const user = new User(userData);
      await user.save();
      employeeUsers.push(user);
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

    await Employee.insertMany(employeesData);

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

    await Resource.insertMany(resourcesData);

    // Create settings
    const settingsData = {
      companyName: 'TechForge Inc',
      companyEmail: 'info@techforge.com',
      companyPhone: '+1-555-0100',
      payrollCycle: 'monthly',
      yieldDistributionPercent: 30,
      notificationEmail: true,
      notificationPayroll: true,
      notificationYield: true,
    };

    await Settings.create(settingsData);

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: 4,
        employees: 4,
        resources: 5,
        settings: 1,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Seeding failed', details: (error as Error).message });
  }
});

export default router;
