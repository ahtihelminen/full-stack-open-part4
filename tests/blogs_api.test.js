const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('REST events', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initalBlogs)
    })
    
    test('get all blogs', async () => {
        const response = await helper.blogsInDb()
        
        expect(response).toHaveLength(helper.initalBlogs.length)
    })
    
    test('blogs defined by id', async () => {
        const response = await helper.blogsInDb()
        response.map(blog => {
            expect(blog.id).toBeDefined()
        })
    })
    
    describe('validating post events', () => {
        test('posting blog', async () => {
            let blog = {
                title: 'test1',
                author: 'post_test',
                url: 'test.com',
                likes: '0'
        
            }
        
            await api
                .post('/api/blogs')
                .send(blog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            const responses = await helper.blogsInDb()
            const contents = responses.map(r => r.title)
            expect(contents).toHaveLength(helper.initalBlogs.length + 1)
            expect(contents).toContain('test1')
        })
        
        test('default amount of likes to be 0', async () => {
            const newBlog = {
                title: 'test0',
                author: 'auth.test0',
                url: 'test0.com',
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const response = await helper.blogsInDb()
            response.map(r => {
                expect(r.likes).toBeDefined()
            })
        
        })
        
        test('if !title respond 400', async () => {
            const newBlog = {
                author: 'auth.test0',
                url: 'test0.com',
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
            
        })
        
        test('if !url respond 400', async () => {
            const newBlog = {
                title: 'test1',
                author: 'auth.test1'
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        })    
    })

    describe('deleting a blog', () => {
        test('succesfull 204, length-1, title not found', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const blogToDelete = blogsAtStart[0]

            await api
                .del(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const response = await helper.blogsInDb()
            const titles = response.map(r => r.title)
            const processedBlogToDelete = JSON.parse(JSON.stringify(blogToDelete))

            expect(response).toHaveLength(helper.initalBlogs.length - 1)
            expect(titles).not.toContain(processedBlogToDelete.title)            
        })
    })
    
    describe('editing a blog', () => {
        test('succesfull PUT request, likes get changed', async () => {
            const blogsAtStart = await helper.blogsInDb()
            let blogToEdit = blogsAtStart[0]
            blogToEdit.likes = blogToEdit.likes + 1
            await api
                .put(`/api/blogs/${blogToEdit.id}`)
                .send(blogToEdit)
                .expect(204)

            const response = await helper.blogsInDb()
            const processedBlogToEdit = JSON.parse(JSON.stringify(blogToEdit))

            expect(response[0].likes).toEqual(processedBlogToEdit.likes)

        })
    })
})






afterAll(() => {
    mongoose.connection.close
})