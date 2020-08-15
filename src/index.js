const express = require('express')
const cors = require('cors')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT
app.use(cors({
    origin: 'http://kamnakis.github.io/task-manager/',
    optionsSuccessStatus: 200
}))
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port', port)
})