const { removeCommentById, uploadComment, updateCommentVotes } = require('../models/comments.model.js')

exports.deleteComentById = (req, res, next) => {
    const commentId = req.params.comment_id
    removeCommentById(commentId)
    .then( () => {
        res.sendStatus(204)
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

exports.patchCommnetById = (req, res, next) => {
    const comment_data = req.body;
    const comment_id = req.params.comment_id;
    updateCommentVotes( comment_id, comment_data)
    .then( comment => {
        res.status(200).send({comment: comment})
    })
    .catch( err => {
        next(err)
    })
}