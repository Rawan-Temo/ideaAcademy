"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../modules/users/user.controller");
const client_1 = require("./client");
const DEFAULT_USER = {
    password: "admnin123",
    username: "admin",
};
async function main() {
    const HASH_PASSWORD = await (0, user_controller_1.hashingPassword)("admin123");
    console.log("Seeding database...");
    DEFAULT_USER.password = HASH_PASSWORD;
    client_1.prisma.user
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
        client_1.prisma.$disconnect();
    });
}
main();
//# sourceMappingURL=seed.js.map