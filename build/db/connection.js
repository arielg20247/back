"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const { Sequelize } = require("sequelize");
exports.database = new Sequelize("imagenes", "root", "", {
    host: "localhost",
    dialect: "mysql",
});
async function main() {
    try {
        await exports.database.authenticate();
        console.log("Connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}
main();
exports.default = exports.database;
