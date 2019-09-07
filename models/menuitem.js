module.exports = function(sequelize, DataTypes) {
  var MenuItem = sequelize.define("MenuItem", {
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("NOW() ON UPDATE NOW()")
    },
    name: DataTypes.STRING,
    calories: DataTypes.INTEGER
  });

  return MenuItem;
};
