const express  = require('express')
const app = express()
const apiRouter = require('./routes/api-router')
const cors = require('cors')

app.use(cors())
app.use(express.json())

/* /api - documentation endpoint that returns and object detailing all available endpoints 
and posible interactions with them */ 
app.use('/api', apiRouter)
app.use('/api/categories', apiRouter)
app.use('/api/reviews', apiRouter)
app.use('/api/reviews/:review_id', apiRouter)
app.post('/api/reviews/:review_id/comments', apiRouter)
app.patch('/api/reviews/:review_id', apiRouter)

app.get('/api/reviews/:review_id/comments', apiRouter)
app.get('/api/users', apiRouter)
app.delete('/api/comments/:comment_id', apiRouter)

/* Invalid endpoint error hanlder*/
app.use((req, res) => {
    res.status(404).send({ status: 404, msg: 'Bad Request' })
})

/* Error hanlder */
app.use((err, req, res, next) => {
    res.status(err.status).send(err)
})

module.exports = app