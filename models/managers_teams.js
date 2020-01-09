'use strict';
module.exports = (sequelize, DataTypes) => {
  const managers_teams = sequelize.define('managers_teams', {
    userId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER
  }, {});
  managers_teams.associate = function(models) {
    // associations can be defined here
  };
  return managers_teams;
};