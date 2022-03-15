const Sequelize = require('sequelize'); // import the Sequelize constructor from the library

require('dotenv').config(); // import the protected credentials in the .env file from npm dotenv

// create connection to our databse, pass in your MySQL informations for username and password
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;
