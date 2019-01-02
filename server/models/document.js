export default (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Content cannot be empty'
        }
      }
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 'public',
      validate: {
        isIn: {
          args: [['public', 'private', 'role']],
          msg: 'Access type should be public, private or role'
        },
      },
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'OwnerId must be an integer'
        }
      }
    },
    ownerRoleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Document.belongsTo(models.User, {
          foreignKey: 'ownerId',
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return Document;
};
