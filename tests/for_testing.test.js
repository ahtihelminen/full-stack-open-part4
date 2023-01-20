const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('test', () => {
    test('dummy returns one', () => {
        const blog = []
        
        const result = listHelper.dummy(blog)
        expect(result).toBe(1)
    })    
})

describe('Total likes', () => {
    test('totalLikes returns 36', () => {
        const result = listHelper.totalLikes(helper.initalBlogs)
        expect(result).toBe(36)
    })
})

describe('Blog with most likes', () => {
    test('Blog with most likes is titled "Canonical string reduction"', () => {
        const expResult =  {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12,
          }
        const result = listHelper.favoriteBlog(helper.initalBlogs)
        expect(result).toEqual(expResult)
    })
})

describe('Writer with most blogs', () => {
    test('Writer with most blogs is "Robert C. Martin"', () => {
      const expResult = {
        author: "Robert C. Martin",
        blogs: 3
      }
      const result = listHelper.mostBlogs(helper.initalBlogs)
      expect(result).toEqual(expResult)
    })
    
})


describe('Writer with most likes', () => {
  test('Writer with most likes is "Edsger W. Dijkstra"', () => {
    const expResult = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    const result = listHelper.mostLikes(helper.initalBlogs)
    expect(result).toEqual(expResult)
  })
})