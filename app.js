const express  = require('express')
const app = express()
const { getCategories } = require('./controllers/categories.controller.js')
const { getApi } = require('./controllers/api.controller.js')
const { getReviewByID, getReviews, patchReviewById, getReviewComments } = require('./controllers/reviews.controller.js')
const { deleteComentById, postComment } = require('./controllers/comments.controller.js')
const { getUsers } = require('./controllers/users.controller.js')
app.use(express.json())

/* /api - documentation endpoint that returns and object detailing all available endpoints 
and posible interactions with them */ 
app.get('/api', getApi)

/* /api/categories */
app.get('/api/categories', getCategories)

/* /api/reviews/:review_id */
app.get('/api/reviews/:review_id', getReviewByID)

app.post('/api/reviews/:review_id/comments', postComment)

app.get('/api/reviews/:review_id/comments', getReviewComments)
/* /api/reviews */
app.get('/api/reviews', getReviews)

app.get('/api/user', getUsers)
app.delete('/api/comments/:comment_id', deleteComentById)
app.patch('/api/reviews/:review_id', patchReviewById)

/* Error hanlder */
app.use((err, req, res, next) => {
    res.status(err.status).send(err)
})
/* Invalid endpoint error hanlder*/
app.use((req, res) => {
    res.status(404).send({ status: 404, msg: 'Bad Request' })
})

module.exports = app