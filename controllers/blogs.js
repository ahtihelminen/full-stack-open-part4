const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { name: 1, username: 1 })

    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const decodedToken = jwt.verify(request.token, config.SECRET)
    
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const user = request.user

    if (!blog.title || !blog.url) {
        return response.status(400).end()
    }

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    const decodedToken = jwt.verify(request.token, config.SECRET)
    if (!request.token || !decodedToken) {
        return response.status(400).json({
            error: 'token missing or invalid'
        })
    }

    const res = await Blog.findByIdAndDelete(id)
    if (res === null) {
        return response.status(400).json({
            error: 'content not found'
        })
    }
    const user = request.user
    user.blogs = user.blogs.filter(blog => blog.id !== id)
    await user.save()

    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const body = request.body

    const updatedBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        id: body.id
    }

    await Blog.findByIdAndUpdate(id, updatedBlog, { new: true })
    response.status(204).json(updatedBlog)
})

module.exports = blogRouter