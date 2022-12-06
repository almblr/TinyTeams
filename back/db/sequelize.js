import { sequelize } from "./db_init.js";
import { DataTypes } from "sequelize";
import { postModel } from "../models/postModel.js";
import { userModel } from "../models/userModel.js";
import { reactionModel } from "../models/reactionModel.js";
import { commentModel } from "../models/commentModel.js";
/* Création des modèles à l'aide de sequelize (et de paramètres) */
export const user = userModel(sequelize, DataTypes);
export const post = postModel(sequelize, DataTypes);
export const react = reactionModel(sequelize, DataTypes);
export const comment = commentModel(sequelize, DataTypes);

/* Création des associations entre les tables */
// Créer la foreignKey "autor" sur la table post
user.hasMany(post, {
  foreignKey: "autor",
  onDelete: "CASCADE",
});
post.belongsTo(user, {
  foreignKey: "autor",
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

// Créer la foreignKey "postId" sur la table comment
post.hasMany(comment, {
  onDelete: "CASCADE",
});
comment.belongsTo(post);

// Créer la foreignKey "userId" sur la table comment
user.hasMany(comment, {
  foreignKey: "autor",
  onDelete: "CASCADE",
});
comment.belongsTo(user, {
  foreignKey: "autor",
});
