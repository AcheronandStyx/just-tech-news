const User = require("./User");
const Post = require("./Post");
const Vote = require('./Vote');
const Comment = require('./Comment');
// create associations
User.hasMany(Post, { // links the users user_id to the user_id in the Post model
    foreignKey: 'user_id'
});

Post.belongsTo(User, { // forges the linke in reverse
    foreignKey: 'user_id',
});


// With these two .belongsToMany() methods in place, we're allowing both the User and Post models to query 
// each other's information in the context of a vote. 
User.belongsToMany(Post, {
    through: Vote, // the User and Post models will be connected through the Vote model
    as: 'voted_posts', // stipulate that the name of the Vote model should be displayed as voted_posts when queried on, making it a little more informative.
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// By also creating one-to-many associations directly between these models, we can perform aggregated SQL functions between models.
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

// Comment associations

// Note that we don't have to specify Comment as a through table like we did for Vote. 
// This is because we don't need to access Post through Comment;
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});
module.exports = { User, Post, Vote, Comment };