'use strict';
module.exports = (sequelize, DataTypes) => {
  const members = sequelize.define('members', {
    name: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER
  }, {});
  members.associate = function(models) {
    models.members.belongsTo(models.teams)
    models.members.belongsTo(models.roles)
  };
  return members;
};