const followModel = (sequelize, DataTypes) => {
  return sequelize.define("follow", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isFollowing: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
};

export default followModel;
