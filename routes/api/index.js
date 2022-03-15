//  in this file we take the routes from user-routes.js and implement them to another router instance, prefixing them with the path /users at that time.
// This level of organization makes the app scalable and the codebase easy to work with

const router = require('express').Router();

const userRoutes = require('./user-routes.js');

router.use('/users', userRoutes);

module.exports = router;
