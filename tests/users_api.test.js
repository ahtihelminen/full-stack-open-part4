const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')


describe('changes in user db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
        
        await user.save()
    })

    test('get users -> 200 and users', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })


    test('post approved user -> 201 and created user', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'test0',
            name: 'test0',
            password: 'test0',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
    
    describe('failed usernames', () => {
        test('post unapproved username -> 400 and err message', async () => {
            const usersAtStart = await helper.usersInDb()
    
            const newUser = {
                username: 'ah',
                name: 'ahti',
                password: 'abcd'
            }
    
            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
    
            const usernames = usersAtEnd.map(u => u.username)
            expect(usernames).not.toContain(newUser.username)
        })
    
        test('post unapproved password -> 400 and err message', async () => {
            const usersAtStart = await helper.usersInDb()
    
            const newUser = {
                username: 'ahtihelminen',
                name: 'ahti',
                password: 'ab'
            }
    
            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
    
            const passwords = usersAtEnd.map(u => u.password)
            expect(passwords).not.toContain(newUser.password)
        })
    
        test('post user with non-unique username', async () => {
            const usersAtStart = await helper.usersInDb()
    
            const newUser = {
                username: 'root',
                name: 'non-unique username test',
                password: 'abcd'
            }
    
            await api   
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            
            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
    
            const passwords = usersAtEnd.map(u => u.passwords)
            expect(passwords).not.toContain(newUser.password)
        })
    })
    
})