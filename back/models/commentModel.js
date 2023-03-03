const commentModel = (sequelize, DataTypes) => {
  return sequelize.define("comment", {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
  });
};

export default commentModel;
