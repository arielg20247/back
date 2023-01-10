const { Sequelize } = require("sequelize");

export const database = new Sequelize("imagenes", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

async function main() {

try {
  await database.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

}

main();

export default database;