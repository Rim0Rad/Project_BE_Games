const { fetchReviewByID, fetchReviews, fetchReviewComments, updateVotes  } = require('../models/reviews.model.js')

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
    .catch(err => {
        next(err)
    })
}
exports.getReviews = (req, res, next) => {
    const {category, sort_by, order} = req.query
    fetchReviews(category, sort_by, order )
    .then( reviews => {
        res.status(200).send({reviews: reviews})
    })
    .catch(err => {
        next(err)
    })
}

exports.patchReviewById = (req, res, next) => {
    const reviewId = req.params.review_id
    const voteData = req.body
    updateVotes(reviewId, voteData)
    .then( review => {
        res.status(200).send({review: review})
    })
    .catch( err => {
        next(err)
    })
}