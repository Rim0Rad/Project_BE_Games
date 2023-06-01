const { deleteComentById, patchCommentById } = require('../controllers/comments.controller');
const commentsRouter = require('express').Router();

commentsRouter.
    delete('/:comment_id', deleteComentById).
    patch('/:comment_id', patchCommentById)

module.exports = commentsRouter;