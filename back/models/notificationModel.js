const notificationModel = (sequelize, DataTypes) => {
  return sequelize.define("notification", {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    notifiableType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notifiable_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
};

export default notificationModel;
