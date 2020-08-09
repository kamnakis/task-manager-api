const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'Mike1234',
    tokens: [{
        token :  jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) 
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Jaden',
    email: 'jaden@example.com',
    password: 'Jaden1234',
    tokens: [{
        token :  jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) 
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test task 1',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test task 2',
    completed: true,
    owner: userTwo._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test task 3',
    completed: false,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await Task.deleteMany()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()

    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}