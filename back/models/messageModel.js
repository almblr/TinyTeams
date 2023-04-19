const messageModel = (sequelize, DataTypes) => {
  return sequelize.define("message", {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

export default messageModel;
