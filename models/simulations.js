'use strict';
module.exports = (sequelize, DataTypes) => {
  const simulations = sequelize.define('simulations', {
    teamId: DataTypes.INTEGER
  }, {});
  simulations.associate = function(models) {
    // associations can be defined here
    models.simulations.belongsTo(models.teams)
    
  };
  return simulations;
};