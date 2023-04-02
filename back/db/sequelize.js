import { sequelize } from "./db_init.js";
import { DataTypes } from "sequelize";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import reactionModel from "../models/reactionModel.js";
import commentModel from "../models/commentModel.js";
import followModel from "../models/followModel.js";
import notificationModel from "../models/notificationModel.js";

export const User = userModel(sequelize, DataTypes);
export const Post = postModel(sequelize, DataTypes);
export const React = reactionModel(sequelize, DataTypes);
export const Comment = commentModel(sequelize, DataTypes);
export const Follow = followModel(sequelize, DataTypes);
export const Notification = notificationModel(sequelize, DataTypes);

/* Création des associations entre les tables */
// Créer la foreignKey "author" sur la table notifications

User.hasMany(Notification, {
  foreignKey: "author",
  onDelete: "CASCADE",
});
Notification.belongsTo(User, {
  foreignKey: "author",
});

// Créer la foreignKey "author" sur la table follows
User.hasMany(Follow, {
  foreignKey: "author",
  onDelete: "CASCADE",
});
Follow.belongsTo(User, {
  foreignKey: "author",
});

// Créer la foreignKey "author" sur la table posts
User.hasMany(Post, {
  foreignKey: "author",
  onDelete: "CASCADE",
});
Post.belongsTo(User, {
  foreignKey: "author",
});

// Créer la foreignKey "postId" sur la table reactions
Post.hasMany(React, {
  onDelete: "CASCADE",
});
React.belongsTo(Post);

// Créer la foreignKey "userId" sur la table reactions
User.hasMany(React, {
  onDelete: "CASCADE",
});
React.belongsTo(User);

// Créer la foreignKey "postId" sur la table comments
Post.hasMany(Comment, {
  onDelete: "CASCADE",
});
Comment.belongsTo(Post);

// Créer la foreignKey "userId" sur la table comments
User.hasMany(Comment, {
  foreignKey: "author",
  onDelete: "CASCADE",
});
Comment.belongsTo(User, {
  foreignKey: "author",
});

// Créer la foreignKey "userId" sur la table notification
User.hasMany(Notification, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Notification.belongsTo(User, {
  foreignKey: "userId",
});
