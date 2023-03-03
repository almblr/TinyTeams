const reactionModel = (sequelize, DataTypes) => {
  return sequelize.define("reaction", {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
  });
};

export default reactionModel;
