const express  = require('express')
const app = express()
const {getCategories} = require('./controllers/categories.controller.js')

app.use(express.json())

/* /api/categories */
app.get('/api/categories', getCategories)




app.use((err, req, res, next) => {
    res.status(400).send({msg: 'Bad REquest', error: err})
})


module.exports = app