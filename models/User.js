const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our User model
class User extends Model { }

// create fields/columns for User model
User.init(
  {
    id: { // define an id column
      type: DataTypes.INTEGER, // use the special Sequelzie DataTypes object to provide what type of data it is
      allowNull: false, //this is the equivalent of SQL's `NOT NULL` option
      primaryKey: true, // instruct that this is teh Primary Key
      autoIncrement: true // turn on auto increment
    },
    username: { // define a username column
      type: DataTypes.STRING,
      allowNull: false
    },
    email: { // define an email column
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // there cannot be any duplicate email values in this table
      validate: { // if allowNull  is set to false, we can run our data through validators before creating the table data
        isEmail: true
      }
    },
    password: { // define a password column
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4] // this means the password must be at least four characters long
      }
    }
  },
  {
    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))
    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    timestamps: false,         // don't automatically create createdAt/updatedAt timestamp fields
    freezeTableName: true,         // don't pluralize name of database table
    underscored: true,         // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    modelName: 'user' // make it so our model name stays lowercase in the database
  }
);

module.exports = User;
