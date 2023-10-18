const User = require('../models/user');

const getUsers = () => {
    return User.find({})
        .then(users => users)
        .catch(error => {
            console.error('Error fetching users:', error);
            throw error;
        });
};

const createUser = (userData) => {

    return User.create(userData)
                .then(user => user)
                .catch(error => {
                    console.error('Error creating user:', error);
                    throw error;
                })
}

const findUser = (userData) => {
    return User.findOne(userData)
                .then(foundUser => foundUser)
                .catch(error => {
                    console.error('Error:', error);
                    throw error;
                });
}

module.exports = {
    getUsers,
    createUser,
    findUser
}