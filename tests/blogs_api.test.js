const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')
const helper = require('./test_helper')


describe('REST events', () => {

    beforeEach(async () => {

        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
        await User.deleteMany({})
        
    })
    
    test('get all blogs', async () => {
        const blogs = await helper.blogsInDb()
        
        expect(blogs).toHaveLength(helper.initialBlogs.length)
    })
    
    test('blogs defined by id', async () => {
        const blogs = await helper.blogsInDb()
        blogs.map(blog => {
            expect(blog.id).toBeDefined()
        })
    })
    
    describe('validating post events', () => {

        test('posting blog', async () => {
            await api
                .post('/api/users')
                .send(helper.initialUser)


            const response = await api
                .post('/api/login')
                .send({ username: 'initUser', password: 'initial'})
            const user_0 = await helper.userForPostingBlog(response)

            const blog = {
                title: 'test1',
                author: 'post_test',
                url: 'test.com',
                likes: '0',
                user: user_0.id
            }
        
            await api
                .post('/api/blogs')
                .send(blog)
                .set({ Authorization: user_0.token })
                .expect(201)
                .expect('Content-Type', /application\/json/)
            const blogss = await helper.blogsInDb()
            const contents = blogss.map(r => r.title)
            expect(contents).toHaveLength(helper.initialBlogs.length + 1)
            expect(contents).toContain('test1')
        })
        
        test('default amount of likes to be 0', async () => {
            
            await api
            .post('/api/users')
            .send(helper.initialUser)


            const response = await api
                .post('/api/login')
                .send({ username: 'initUser', password: 'initial'})
            const user_0 = await helper.userForPostingBlog(response)

            const newBlog = {
                title: 'test0',
                author: 'auth.test0',
                url: 'test0.com',
                id: user_0.id
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: user_0.token })
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const blogs = await helper.blogsInDb()
            blogs.map(b => {
                expect(b.likes).toBeDefined()
            })
        
        })
        
        test('if !title respond 400', async () => {
            await api
                .post('/api/users')
                .send(helper.initialUser)


            const blogs = await api
                .post('/api/login')
                .send({ username: 'initUser', password: 'initial'})
            const user_0 = await helper.userForPostingBlog(blogs)
            
            const newBlog = {
                author: 'auth.test0',
                url: 'test0.com',
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: user_0.token })
                .expect(400)
            
        })
        
        test('if !url respond 400', async () => {
            await api
            .post('/api/users')
            .send(helper.initialUser)


            const blogs = await api
                .post('/api/login')
                .send({ username: 'initUser', password: 'initial'})
            const user_0 = await helper.userForPostingBlog(blogs)

            const newBlog = {
                title: 'test1',
                author: 'auth.test1'
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: user_0.token })
                .expect(400)
        })

        test('unauthorized request -> 401', async () => {
            await api
                .post('/api/users')
                .send(helper.initialUser)


            const blogs = await api
                .post('/api/login')
                .send({ username: 'initUser', password: 'initial'})
            const user_0 = await helper.userForPostingBlog(blogs)

            const blog = {
                title: 'test',
                author: 'post_test',
                url: 'test.com',
                likes: '0',
                user: user_0.id
            }

            await api
                .post('/api/blogs')
                .send(blog)
                .set({ Authorization: '' })
                .expect(401)
                .expect('Content-Type', /application\/json/)

            await api
                .post('/api/blogs')
                .send(blog)
                .set({ Authorization: 'bearer 0123456789' })
                .expect(401)
                .expect('Content-Type', /application\/json/)    
        })
    })

    describe('deleting a blog', () => {
        test('succesfull 204, length-1, title not found', async () => {
            await api
                .post('/api/users')
                .send(helper.initialUser)


            const response = await api
                .post('/api/login')
                .send({ username: 'initUser', password: 'initial'})
            const user_0 = await helper.userForPostingBlog(response)

            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .del(`/api/blogs/${blogToDelete.id}`)
                .set({ Authorization: user_0.token })
                .expect(204)

            const blogs = await helper.blogsInDb()
            const titles = blogs.map(r => r.title)
            const processedBlogToDelete = JSON.parse(JSON.stringify(blogToDelete))

            expect(blogs).toHaveLength(helper.initialBlogs.length - 1)
            expect(titles).not.toContain(processedBlogToDelete.title)            
        })
    })
    
    describe('editing a blog', () => {
        test('succesfull PUT request, likes get changed', async () => {
            
            
            await api
            .post('/api/users')
            .send(helper.initialUser)


            const response = await api
                .post('/api/login')
                .send({ username: 'initUser', password: 'initial'})
            const user_0 = await helper.userForPostingBlog(response)
            
            const blogsAtStart = await helper.blogsInDb()
            let blogToEdit = blogsAtStart[0]
            blogToEdit.likes = blogToEdit.likes + 1

            await api
                .put(`/api/blogs/${blogToEdit.id}`)
                .send(blogToEdit)
                .set({ Authorization: user_0.token })
                .expect(204)

            const blogs = await helper.blogsInDb()
            const processedBlogToEdit = JSON.parse(JSON.stringify(blogToEdit))

            expect(blogs[0].likes).toEqual(processedBlogToEdit.likes)

        })
    })
})






afterAll(() => {
    mongoose.connection.close
})