import bcrypt from 'bcrypt-nodejs';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First Name is required'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last Name is required'
        }
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 2,
      validate: {
        isInt: {
          msg: 'roleId must be an integer'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'This email is already taken.'
      },
      validate: {
        isEmail: {
          msg: 'Email address is invalid'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activeToken: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        User.belongsTo(models.Role,
          { foreignKey: 'roleId'
          });
        User.hasMany(models.Document, { foreignKey: 'ownerId' });
      }
    },
    instanceMethods: {
      /**
       * Compare plain password to user's hashed password
       * @param {String} password
       * @returns {Boolean} - true if password is correct, otherwise false
       */
      verifyPassword(password) {
        return bcrypt.compareSync(password, this.password);
      },

      /**
       * Hash user's password
       * @method
       * @returns {Void} - Returns void
       */
      hashPassword() {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
      }
    },
    hooks: {
      beforeCreate(user) {
        user.hashPassword();
      },
      beforeUpdate(user) {
        if (user._changed.password) {
          user.hashPassword();
        }
      }
    }
  });
  return User;
};
