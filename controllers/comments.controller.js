const { uploadComment } = require('../models/comments.model.js')

exports.postComment = (req, res, next) => {
    
    const comment = req.body;
    const review_id = Number(req.params.review_id)
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