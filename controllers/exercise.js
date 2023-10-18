const Exercise = require('../models/exercise');

const createExercise = (execiseData) => {
    return Exercise.create({execiseData})
                    .then(exercise => exercise)
                    .catch(error => {
                        console.error('Error creating exercise:', error);
                        throw error;
                    })
}

module.exports = {
    createExercise
}