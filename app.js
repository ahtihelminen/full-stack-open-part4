const express = require('express')
const app = express()
require('express-async-errors')

const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./utils/config')

mongoose.connect(config.MONGO_URL)


app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)

module.exports = app