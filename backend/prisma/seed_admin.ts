import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking for admin user...");
  
  // Find any admin user
  const admin = await prisma.user.findFirst({
    where: {
      role: "admin",
    },
  });

  if (admin) {
    console.log(`Admin user already exists: ${admin.email}`);
    return;
  }

  // Create new admin
  const email = "admin@lapor.in";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: "admin",
      location: "Jakarta",
    },
  });

  console.log("----------------------------------------");
  console.log("   Admin user successfully seeded!");
  console.log(`   Email   : ${newAdmin.email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Role    : ${newAdmin.role}`);
  console.log("----------------------------------------");
}

main()
  .catch((e) => {
    console.error("Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
