const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require("body-parser");
let mongoose = require('mongoose');

const { getUsers, createUser, findUser, findUserbyId } = require( __dirname + '/controllers/user');
const { createExercise, findExercise, findExerciseByUsername, findExerciseByDates } = require(__dirname + '/controllers/exercise');

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
    } else {
      res.json({message: 'Already in database', username: userFind.username, _id: userFind._id});
    }

    
  } catch (error) {
    res.status(500).json({ message: 'Failed to create a new user', error: error });
  } 
});

/** EXERCISES */

app.post('/api/users/:_id/exercises', async(req, res) => {
  const id = req.params._id;
  let {description, duration, date} = req.body;

  if(!date) {
    date = new Date().toDateString();
  } else {
    date = new Date(date).toDateString();
  }

  try {

    const user = await findUserbyId({_id: id});

    if (user != null){
      let newExercise = {
        username: user.username,
        description: description,
        duration: duration,
        date: date
      };

      let exercise = await findExercise(newExercise);

      if(exercise == null){
        await createExercise(newExercise);

        let jsonRes = {
          _id: user._id,
          username: user.username,
          description: description,
          duration: parseInt(duration),
          date: new Date(date).toDateString(),
        }

        res.status(200).json(jsonRes)
      } else {
        res.status(302).json({message: 'Exercise already in database', exercise: exercise})
      }
    } else {
      res.status(404).json({message: 'User does not exists'});
    }
    
  } catch (error) {
    res.status(500).json({message: 'Failed to create new exercise', error: error});
  }
  
});

/** LOGS */

app.get('/api/users/:_id/logs', async(req, res) => {
  const userId = req.params._id;
  let log = [];
  let exercises;

  try {
    const user = await findUserbyId({_id: userId});

    if(user != null){

      if((req.query.from) || (req.query.to) || (req.query.limit)){
        let { from, to, limit } = req.query;

        if(from == undefined) {
          from = '1970-01-01';
        }

        if(to == undefined) {
          to = '2038-01-19'
        }

        if(limit == undefined){
          limit = Number.MAX_SAFE_INTEGER;
        }

        exercises = await findExerciseByDates({username: user.username, date: {$gte: from, $lte: to}}, limit);

      } else {
        exercises = await findExerciseByUsername({username: user.username})
      }

      if(exercises != null) {
        log = exercises.map(exercise => ({
          description: exercise.description,
          duration: exercise.duration,
          date: new Date(exercise.date.toString()).toDateString(),
        }));

        let jsonRes = {
          username: user.username,
          count: exercises.length,
          _id: user._id,
          log: log,
        }

        res.status(200).json(jsonRes);

      } else {
        res.status(404).json({message: 'User does not have exercises'});
      }

    } else {
      res.status(404).json({message: 'User does not exists'});
    }
    
  } catch (error) {
    res.status(500).json({message: 'Failed to retrieve new exercise', error: error});
  }
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
