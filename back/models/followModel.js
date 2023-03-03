const followModel = (sequelize, DataTypes) => {
  return sequelize.define("follow", {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
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
