const { fetchReviewByID, fetchReviewComments } = require('../models/reviews.model.js')

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

exports.getReviewComments = (req, res, next) => {
    const id = Number(req.params.review_id)
    fetchReviewComments(id)
    .then(comments => {
        res.status(200).send({comments: comments})
    })
    .catch( err => {
        next(err)
    })
}