const express = require('express')
const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
    userOne, 
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase 
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'This is a test task!'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Get all tasks for user one', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toBe(1)
})

test('Should not delete other users tasks', async () => {
    await request(app)
        .delete('/tasks/' + taskTwo._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)

    const task = await Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
})

test('Should delete user tasks', async () => {
    await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()
})

test('Should delete user tasks', async () => {
    await request(app)
        .delete('/tasks/' + taskOne._id)
        .expect(401)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})