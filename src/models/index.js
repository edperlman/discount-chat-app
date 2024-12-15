'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../../config/config.js'))[env]; // Ensure this path is correct

const db = {};

// Initialize Sequelize with the configuration for the current environment
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logging: console.log, // Logs SQL queries; set to false to disable
  }
);

// Dynamically load all model files in the current directory
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && // Exclude hidden files
      file !== basename && // Exclude this index.js file
      file.slice(-3) === '.js' // Include only .js files
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      DataTypes
    );
    db[model.name] = model; // Add the model to the db object
  });

// Associate models if applicable
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach Sequelize and the instance to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;