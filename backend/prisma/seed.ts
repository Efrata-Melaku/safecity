import prisma from '../src/config/prisma.js';
import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.adminUser.upsert({
    where: { email: 'safecity123@gmail.com' },
    update: {},
    create: {
      email: 'safecity123@gmail.com',
      passwordHash,
      name: 'System Admin',
      role: 'super_admin',
      mustChangePassword: true,
    },
  });

  await prisma.supportResource.createMany({
    data: [
      { name: 'Safe City Hotline', description: 'Primary confidential hotline for reporting abuse and obtaining immediate assistance.', phone: '7614', category: 'emergency_hotline', priority: 'high' },
      { name: 'Police Emergency', description: 'National emergency police response.', phone: '991', category: 'emergency_hotline', priority: 'high' },
      { name: 'Women and Children Hotline', description: 'Support hotline for women and children experiencing abuse or violence.', phone: '688', category: 'emergency_hotline', priority: 'high' },
      { name: 'Ethiopian Federal Police', description: 'National police emergency response.', phone: '991', category: 'police', priority: 'high' },
      { name: 'Hawassa City Police', description: 'Local police services for Hawassa City.', phone: '', category: 'police', priority: 'medium' },
      { name: 'Women and Children Affairs Bureau', description: 'Government office providing protection, counseling, and referral services for women and children.', phone: '', category: 'womens_support', priority: 'high' },
      { name: 'Adare General Hospital', description: 'General hospital serving Hawassa region.', phone: '', category: 'hospitals', priority: 'medium' },
      { name: 'Hawassa University Comprehensive Specialized Hospital', description: 'Major referral hospital in Hawassa.', phone: '', category: 'hospitals', priority: 'medium' },
      { name: 'Local Legal Aid Organization', description: 'Provides legal assistance to survivors of abuse.', phone: '', category: 'legal_aid', priority: 'medium' },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
