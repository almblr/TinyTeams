import { Sequelize } from "sequelize";
import "dotenv/config";

/// Initialisation de la BDD avec l'ORM Sequelize. DB = Database
export const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER_NAME,
  process.env.PASSWORD,
  {
    dialect: "mysql",
    host: process.env.HOST,
  }
);
