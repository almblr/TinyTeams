const commentModel = (sequelize, DataTypes) => {
  return sequelize.define("comment", {
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

export default commentModel;
