const { removeCommentById, uploadComment } = require('../models/comments.model.js')

exports.deleteComentById = (req, res, next) => {
    const commentId = req.params.comment_id
    removeCommentById(commentId)
    .then( () => {
        res.status(204).send()
    })
    .catch( err => {
        next(err)
    })
}

exports.postComment = (req, res, next) => {
    
    const comment = req.body;
    const review_id = req.params.review_id
    uploadComment(comment, review_id)
    .then( comment => {
        res.status(201).send({comment: comment})
    })
    .catch( err => {
        if(err.code === '23503'){
            err = {status:404, msg: "Review does not exist"}
        }
        next(err)
    })
}