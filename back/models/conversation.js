const conversationModel = (sequelize, DataTypes) => {
  return sequelize.define("conversation", {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
  });
};

export default conversationModel;