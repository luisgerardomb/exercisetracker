const Exercise = require('../models/exercise');

const createExercise = (exerciseData) => {
    return Exercise.create(exerciseData)
                    .then(exercise => exercise)
                    .catch(error => {
                        console.error('Error creating exercise:', error);
                        throw error;
                    });
}

const findExercise = (exerciseData) => {
    return Exercise.findOne(exerciseData)
                    .then(foundExercise => foundExercise)
                    .catch(error => {
                        console.error('Error: ', error);
                        throw error;
                    });
}

const findExerciseByUsername = (exerciseData) => {
    return Exercise.find(exerciseData)
                    .then(foundExercise => foundExercise)
                    .catch(error => {
                        console.error('Error: ', error);
                        throw error;
                    });
}

const findExerciseByDates = (exerciseData, limit) => {
    return Exercise.find(exerciseData)
                    .limit(limit)
                    .then(foundExercise => foundExercise)
                    .catch(error => {
                        console.error('Error: ', error);
                        throw error;
                    });
}

module.exports = {
    createExercise,
    findExercise,
    findExerciseByUsername,
    findExerciseByDates
}