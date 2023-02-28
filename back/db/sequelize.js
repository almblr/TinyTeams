import { sequelize } from "./db_init.js";
import { DataTypes } from "sequelize";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import reactionModel from "../models/reactionModel.js";
import commentModel from "../models/commentModel.js";
import followModel from "../models/followModel.js";

export const user = userModel(sequelize, DataTypes);
export const post = postModel(sequelize, DataTypes);
export const react = reactionModel(sequelize, DataTypes);
export const comment = commentModel(sequelize, DataTypes);
export const follow = followModel(sequelize, DataTypes);

/* Création des associations entre les tables */
// Créer la foreignKey "author" sur la table follows
user.hasMany(follow, {
  foreignKey: "author",
  onDelete: "CASCADE",
});
follow.belongsTo(user, {
  foreignKey: "author",
});

// Créer la foreignKey "author" sur la table posts
user.hasMany(post, {
  foreignKey: "author",
  onDelete: "CASCADE",
});
post.belongsTo(user, {
  foreignKey: "author",
});

// Créer la foreignKey "postId" sur la table reactions
post.hasMany(react, {
  onDelete: "CASCADE",
});
react.belongsTo(post);

// Créer la foreignKey "userId" sur la table reactions
user.hasMany(react, {
  onDelete: "CASCADE",
});
react.belongsTo(user);

// Créer la foreignKey "postId" sur la table comments
post.hasMany(comment, {
  onDelete: "CASCADE",
});
comment.belongsTo(post);

// Créer la foreignKey "userId" sur la table comments
user.hasMany(comment, {
  foreignKey: "author",
  onDelete: "CASCADE",
});
comment.belongsTo(user, {
  foreignKey: "author",
});
