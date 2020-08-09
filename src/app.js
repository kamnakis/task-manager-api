const express = require('express')
const cors = require('cors')

require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
app.use(cors({
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200
}))
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app