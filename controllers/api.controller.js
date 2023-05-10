const { fetchApi } = require('../models/api.model.js')

exports.getApi = ( req, res, next ) => {
    fetchApi()
    .then(result => {
        res.status(200).send(result)
    })
    .catch( err => {
        next(err)
    })
}