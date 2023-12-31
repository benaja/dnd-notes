import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const prisma = new PrismaClient();
  const user = await prisma.user.create({
    data: {
      name: "Benaja",
      email: "benhu00@outlook.com",
      password: await hash("123abc123", 10),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
