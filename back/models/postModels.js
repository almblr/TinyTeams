// Ce fichier est uniquement la fonction à utiliser pour la création du modèle qui se fait dans sequelize.js
export const postModel = (sequelize, DataTypes) => {
  return sequelize.define("post", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
    },
    imageUrl: {
      type: DataTypes.TEXT,
    },
  });
};
