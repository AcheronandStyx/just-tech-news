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
