'use strict';
module.exports = (sequelize, DataTypes) => {
  const teams = sequelize.define('teams', {
    name: DataTypes.STRING
  }, {});
  teams.associate = function(models) {
    // associations can be defined here
    models.teams.hasMany(models.roles)
    models.teams.hasMany(models.members)
    models.teams.belongsToMany(models.user, {
      through: 'managers_teams'
    })
  };
  return teams;
};