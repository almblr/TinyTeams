import { Sequelize } from "sequelize";
import "dotenv/config";

// Initialisation de la BDD
export const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER_NAME,
  process.env.PASSWORD,
  {
    dialect: "sqlite",
    storage: "db.sqlite",
  }
);
