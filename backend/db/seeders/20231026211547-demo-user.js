'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Lane17027',
        firstName: 'Lane',
        lastName: 'Nichols',
        hashedPassword: bcrypt.hashSync('Lane17027')
      },
      {
        email: 'user1@user.io',
        username: 'LaniLeBaron',
        firstName: 'Lani',
        lastName:'LeBaron',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: 'Quinn',
        lastName:'Bush',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Lane17027', 'LaniLeBaron', 'FakeUser2'] }
    }, {});
  }
};
