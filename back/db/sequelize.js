import { sequelize } from "./db_init.js";
import { DataTypes } from "sequelize";
import { postModel } from "../models/postModels.js";
import { userModel } from "../models/userModels.js";
import { reactionModel } from "../models/reactionModels.js";
/* Création des modèles à l'aide de sequelize (et de paramètres) */
export const user = userModel(sequelize, DataTypes);
export const post = postModel(sequelize, DataTypes);
export const react = reactionModel(sequelize, DataTypes);

/* Création des associations entre les tables */
// Créer la foreignKey "createdBy" sur la table post
user.hasMany(post, {
  foreignKey: "createdBy",
  onDelete: "CASCADE",
});
post.belongsTo(user, {
  foreignKey: "createdBy",
});

// Créer la foreignKey "postId" sur la table react
post.hasMany(react, {
  onDelete: "CASCADE",
});
react.belongsTo(post);

// Créer la foreignKey "userId" sur la table react
user.hasMany(react, {
  onDelete: "CASCADE",
});
react.belongsTo(user);
