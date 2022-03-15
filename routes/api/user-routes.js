const router = require('express').Router();
const { User } = require('../../models');

// get all users
// Access our User model and run .findAll() method
// .findAll() is one of the Model class's methods. The .findAll() method lets us query all of the users from the user table in the database,
// equivalent of SQL -> SELECT * FROM users;
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] } // do not return the users password!
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /api/users/1
// we're using the where option to indicate we want to find a user where its id value equals whatever req.params.id
// Equivalent of SQL -> SELECT * FROM users WHERE id = 1
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] }, // do not return the users password!
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => { // incase we search for a nonexsistent id, throw a 404
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users
// To insert data, we can use Sequelize's .create() method. Pass in key/value pairs 
// where the keys are what we defined in the User model and the values are what we get from req.body.
/* In SQL
INSERT INTO users
  (username, email, password)
VALUES
  ("Lernantino", "lernantino@gmail.com", "password1234");
*/
router.post('/', (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// login route -> http://localhost:3001/api/users/login
// We use a POST request for logins because A GET method carries the request parameter appended in the URL string, whereas a POST method carries the request parameter in req.body
router.post('/login', (req, res) => {
  // expects {email: 'lernantino@gmail.com', password: 'password1234'}
  User.findOne({
    where: {
      email: req.body.email // query the User table using the findOne() method for the email entered by the user and assigned it to req.body.email.
      
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' }); // If the user with that email was not found, a message is sent back as a response to the client. 
      return;
    }
    // if the email was found in the database, the next step will be to verify the user's identity by matching the password from the user and the hashed password in the database.
    // res.json({ user: dbUserData });

    // verify user

    // Note that the instance method was called on the user retrieved from the database, dbUserData. Because the instance 
    // method returns a Boolean, we can use it in a conditional statement to verify whether the user has been verified or not.
    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) { // if the match returns a false value, an error message is sent back to the client, and the return statement exits out of the function immediately.
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
    // if there is a match, the conditional statement block is ignored, and a response with the data and the message "You are now logged in." is sent instead.
    res.json({ user: dbUserData, message: 'You are now logged in!' });
  })

})


// PUT /api/users/1

// This .update() method combines the parameters for creating data and looking up data. We pass in req.body 
// to provide the new data we want to use in the update and req.params.id to indicate where exactly we want that new data to be used.
/*In SQL
UPDATE users
SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
WHERE id = 1;
*/
router.put('/:id', (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  // pass in req.body instead to only update what's passed through
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE /api/users/1

// To delete data, use the .destroy() method and provide some type of identifier to indicate where exactly we would like to delete data from the user database table.
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
