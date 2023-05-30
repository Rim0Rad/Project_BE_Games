const reviewRouter = require('express').Router();
const { getReviews, getReviewByID, patchReviewById, getReviewComments } = require('../controllers/reviews.controller.js')
const { deleteComentById, postComment } = require('../controllers/comments.controller.js')

reviewRouter.get('/', getReviews)
reviewRouter.
    get('/:review_id', getReviewByID).
    patch('/:review_id', patchReviewById)

reviewRouter.
    get('/:review_id/comments', getReviewComments).
    post('/:review_id/comments', postComment)

module.exports = reviewRouter;