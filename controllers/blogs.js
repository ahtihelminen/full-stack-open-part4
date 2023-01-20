const blogRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    if (!blog.title || !blog.url) {
        return response.status(400).end()
    }

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    await Blog.findByIdAndDelete(id)
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