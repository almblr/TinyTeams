const reactionModel = (sequelize, DataTypes) => {
  return sequelize.define("reaction", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  });
};

export default reactionModel;
