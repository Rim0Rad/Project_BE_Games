const express  = require('express')
const app = express()
const { getCategories } = require('./controllers/categories.controller.js')
const { getApi } = require('./controllers/api.controller.js')
const { getReviewByID } = require('./controllers/reviews.controller.js')

app.use(express.json())

/* /api - documentation endpoint that returns and object detailing all available endpoints 
and posible interactions with them */ 
app.get('/api', getApi)

/* /api/categories */
app.get('/api/categories', getCategories)


app.use((err, req, res, next) => {
    res.status(err.status).send(err)
})


module.exports = app