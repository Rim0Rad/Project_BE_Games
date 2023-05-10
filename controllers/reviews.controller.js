const { fetchReviewByID, fetchReviews } = require('../models/reviews.model.js')

exports.getReviewByID = (req, res, next) => {
    const id = req.params.review_id
    fetchReviewByID(id)
    .then(review => {
        res.status(200).send({review: review})
    })
    .catch( err => {
        next(err)
    })
}

exports.getReviews = (req, res, next) => {

    fetchReviews()
    .then( reviews => {
        res.status(200).send({reviews: reviews})
    })
    .catch(err => {
        next(err)
    })
}