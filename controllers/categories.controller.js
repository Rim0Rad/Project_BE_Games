const {fetchCategories} = require('../models/categories.module.js')

exports.getCategories = (req, res, next) => {
    fetchCategories()
    .then(categories => {
        res.status(200).send({categories: categories})
    })
    .catch( err => {
        next(err)
    })
        
    
}