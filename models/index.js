const User = require("./User");
const Post = require("./Post");

// create associations
User.hasMany(Post, { // links the users user_id to the user_id in the Post model
    foreignKey: 'user_id'
});

Post.belongsTo(User, { // forges the linke in reverse
    foreignKey: 'user_id',
  });

module.exports = { User, Post };