const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, userOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Stelios',
        email: 'stelios@example.com',
        password: 'Stelios1234'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assetrions about the result
    expect(response.body).toMatchObject({
        user: {
            name: 'Stelios',
            email: 'stelios@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Stelios1234')
})

test('Should not signup user with invalid data', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'whatever',
            email: 'notAnEmail',
            password: '12345678'
        })
        .expect(400)
    
    await request(app)
        .post('/users')
        .send({
            name: 'whatever',
            email: 'test@example.com',
            password: '123'
        })
        .expect(400)
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login user with wrong credentials', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: '12345678'
    }).expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get user profile due to authentication', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not delete account due to authentication', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    const userUpdates = {
        name: 'Stelios Kamnakis'
    }
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(userUpdates)
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe(userUpdates.name)
})

test('Should not update invalid user fields', async () => {
    const userUpdates = {
        location: 'Greece'
    }
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(userUpdates)
        .expect(400)
})

test('Should not update if unauthenticated', async () => {
    const userUpdates = {
        name: 'Michael'
    }
    await request(app)
        .patch('/users/me')
        .set('Authorization', ``)
        .send(userUpdates)
        .expect(401)
})

test('Should not update user with invalid data', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'whatever',
            email: 'notAnEmail',
            password: '12345678'
        })
        .expect(400)
    
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'whatever',
            email: 'test@example.com',
            password: '123'
        })
        .expect(400)
})