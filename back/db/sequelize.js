import { sequelize } from "./db_init.js";
import { DataTypes } from "sequelize";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import reactionModel from "../models/reactionModel.js";
import commentModel from "../models/commentModel.js";
import followModel from "../models/followModel.js";
import notificationModel from "../models/notificationModel.js";
import conversationModel from "../models/conversation.js";
import messageModel from "../models/messageModel.js";

export const User = userModel(sequelize, DataTypes);
export const Post = postModel(sequelize, DataTypes);
export const React = reactionModel(sequelize, DataTypes);
export const Comment = commentModel(sequelize, DataTypes);
export const Follow = followModel(sequelize, DataTypes);
export const Notification = notificationModel(sequelize, DataTypes);
export const Conversation = conversationModel(sequelize, DataTypes);
export const Message = messageModel(sequelize, DataTypes);

/* Création des associations entre les tables */

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

// Créer la foreignKey "receiver" sur la table notification
User.hasMany(Notification, {
  foreignKey: "receiver",
  onDelete: "CASCADE",
});

Notification.belongsTo(User, {
  foreignKey: "receiver",
});

// Créer la foreignKey "postId" sur la table notification
Post.hasMany(Notification, {
  foreignKey: {
    allowNull: true,
  },
  onDelete: "CASCADE",
});

Notification.belongsTo(Post, {
  foreignKey: {
    allowNull: true,
  },
});

//// Créer la foreignKey "author" sur la table message
User.hasMany(Message, {
  foreignKey: "author",
  onDelete: "CASCADE",
});
Message.belongsTo(User, {
  foreignKey: "author",
});

//// Créer la foreignKey "conversationId" sur la table message
Conversation.hasMany(Message, {
  foreignKey: "conversationId",
  onDelete: "CASCADE",
});
Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
});

// Créer la foreignKey "user1" sur la table conversation
User.hasMany(Conversation, {
  foreignKey: "user1",
  onDelete: "CASCADE",
});
Conversation.belongsTo(User, {
  foreignKey: "user1",
});

// Créer la foreignKey "user2" sur la table conversation
User.hasMany(Conversation, {
  foreignKey: "user2",
  onDelete: "CASCADE",
});
Conversation.belongsTo(User, {
  foreignKey: "user2",
});
