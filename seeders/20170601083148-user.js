const dotenv = require('dotenv');
const bcrypt = require('bcrypt-nodejs');

dotenv.config();
module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [
      {
        email: process.env.ADMIN_EMAIL,
        firstName: process.env.ADMIN_FIRST_NAME,
        lastName: process.env.ADMIN_LAST_NAME,
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD,
                  bcrypt.genSaltSync(8)),
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@sample.com',
        firstName: 'user1',
        lastName: 'user1',
        password: bcrypt.hashSync('sampleuser1',
                  bcrypt.genSaltSync(8)),
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@sample.com',
        firstName: 'user2',
        lastName: 'user2',
        password: bcrypt.hashSync('sampleuser2',
                  bcrypt.genSaltSync(8)),
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {
      returning: true
    });
  },

  down(queryInterface) {
    queryInterface.bulkDelete('Users', null, {});
  }
};
