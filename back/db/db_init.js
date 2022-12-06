import { Sequelize } from "sequelize";
import SQLite from "sqlite3";
import "dotenv/config";

/// Initialisation de la BDD avec l'ORM Sequelize. DB = Database
export const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER_NAME,
  process.env.PASSWORD,
  {
    dialect: "sqlite",
    storage: "db.sqlite",
  }
);
