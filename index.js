const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require("body-parser");
let mongoose = require('mongoose');

const { getUsers, createUser, findUser } = require( __dirname + '/controllers/user');
const { createExercise } = require(__dirname + '/controllers/exercise');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

/** MIDDLEWARES */
const validateUsername = (req, res, next) => {
  const {username} = req.body;

  if(!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  next();
}

const validateDate = (req, res, next) => {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  const {date} = req.body;

  if(!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  if(!regEx.test(date)){
    return res.status(400).json({ error: `${date} is not a valid date - must be in format yyyy-mm-dd`});
  }

  next();
}

/** USERS */

app.get('/api/users', async(req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

app.post('/api/users', validateUsername, async(req, res) => {
  const userData = req.body;

  try {
    const userFind = await findUser(userData);

    if(userFind == null) {
      const user = await createUser(userData);
      res.json({username : user.username, _id: user._id});
    }
    else 
    {
      res.json({message: 'Already in database', username: userFind.username, _id: userFind._id});
    }

    
  } catch (error) {
    res.status(500).json({ message: 'Failed to create a new user', error: error });
  } 
});

/** EXERCISES */

app.post('/api/users/:_id/exercises', validateDate, async(req, res) => {
  const userId = req.params._id;
  const {description, duration, date} = req.body;

  const formattedDate = Number((date))
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
