const sequelize = require('../../config/database');
const User = require('../../modules/Users/models/user');

const initModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await sequelize.sync();
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

module.exports = { sequelize, User, initModels };