const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, likes) => {
        return sum + likes
    }
    let likes_array = []
    blogs.map(blog => likes_array.push(blog.likes)) 
    return likes_array.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let likes_array = []
    blogs.map(blog => likes_array.push(blog.likes))
    let mostLikes = Math.max(...likes_array)
    let blogWithMostLikes =  blogs.find(blog => blog.likes === mostLikes)
    return {
        title: blogWithMostLikes.title,
        author: blogWithMostLikes.author,
        likes: blogWithMostLikes.likes
    }
}

const mostBlogs = (blogs) => {
    let author_array = []
    blogs.forEach(blog => {
        if (!author_array.find(obj => obj.author === blog.author)) {
            author_array.push({
                author: blog.author,
                blogs: _.filter(blogs, _.matches({author: blog.author})).length
            })
        }
    })
    return _.sortBy(author_array, [function(obj) {return obj.blogs}])[author_array.length-1]    
}   

const mostLikes = (blogs) => {
    let author_array = []
    blogs.forEach(blog => {
        if (!author_array.find(obj => obj.author === blog.author)) {
            let blogsWithSameAuthor = _.filter(blogs, _.matches({author: blog.author}))
            let likes_array = []
            let initialVal = 0
            blogsWithSameAuthor.map(blog => likes_array.push(blog.likes))
            author_array.push({
                author: blog.author,
                likes: likes_array.reduce((sum, init) => sum + init, initialVal)
            })
        }
    })

    return _.sortBy(author_array, [function(obj) {return obj.likes}])[author_array.length-1]
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}