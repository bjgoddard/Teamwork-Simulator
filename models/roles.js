'use strict';
module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define('roles', {
    name: DataTypes.STRING,
    icon: DataTypes.STRING,
    image: DataTypes.STRING,
    teamId: DataTypes.INTEGER
  }, {});
  roles.associate = function(models) {
    // associations can be defined here
    models.roles.hasMany(models.members)
    models.roles.belongsTo(models.teams)
  };
  return roles;
};