const express  = require('express')
const app = express()
const { getCategories } = require('./controllers/categories.controller.js')
const { getApi } = require('./controllers/api.controller.js')
const { getReviewByID, getReviews, getReviewComments } = require('./controllers/reviews.controller.js')

app.use(express.json())

/* /api - documentation endpoint that returns and object detailing all available endpoints 
and posible interactions with them */ 
app.get('/api', getApi)

/* /api/categories */
app.get('/api/categories', getCategories)

/* /api/reviews/:review_id */
app.get('/api/reviews/:review_id', getReviewByID)

app.get('/api/reviews/:review_id/comments', getReviewComments)
/* /api/reviews */
app.get('/api/reviews', getReviews)

/* Error hanlder */
app.use((err, req, res, next)=> {
    res.status(err.status).send(err)
})
/* Invalid endpoint error hanlder*/
app.use((req, res) => {
    res.status(404).send({msg: 'Bad Request', status: 404})
})

module.exports = app