import { UserCreateInput } from "../generated/prisma/models";
import { hashingPassword } from "../modules/users/user.controller";
import { prisma } from "./client";

const DEFAULT_USER: UserCreateInput = {
  password: "admnin123",
  username: "admin",
};

async function main() {
  const HASH_PASSWORD = await hashingPassword("admin123");
  console.log("Seeding database...");
  DEFAULT_USER.password = HASH_PASSWORD;
  prisma.user
    .upsert({
      where: { username: DEFAULT_USER.username },
      update: {},
      create: DEFAULT_USER,
    })
    .then(() => {
      console.log("Database seeded successfully.");
    })
    .catch((error) => {
      console.error("Error seeding database:", error);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

main();
