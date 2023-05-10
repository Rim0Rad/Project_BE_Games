const { fetchReviewByID } = require('../models/reviews.model.js')

exports.getReviewByID = (req, res, next) => {
    const id = Number(req.params.review_id)
    fetchReviewByID(id)
    .then(review => {
        res.status(200).send({review: review})
    })
    .catch( err => {
        next(err)
    })
}