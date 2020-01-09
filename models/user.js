'use strict';

let bcrypt= require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 30],
          msg: 'Username is required.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Valid email address is required.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 25],
          msg: 'Your password must be between 6 and 25 characters'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: pendingUser => {
        if (pendingUser && pendingUser.password) {
          //Hash the password
          let hashedPassword = bcrypt.hashSync(pendingUser.password, 12)

          //Reassign the password field to hashed value
          pendingUser.password = hashedPassword
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
    models.user.belongsToMany(models.teams, {
      through: 'managers_teams'
    })
  };

  user.prototype.validPassword = function (typedInPassword) {
    console.log('compare')
    // Determine if typed-in password hashes to same thing as existing hash
    let correctPassword = bcrypt.compareSync(typedInPassword, this.password)
    // Return the result of that comparison
    return correctPassword
  }

  return user;
};