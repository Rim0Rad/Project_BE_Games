const { deleteComentById, patchCommnetById } = require('../controllers/comments.controller');
const commentsRouter = require('express').Router();

commentsRouter.
    delete('/:comment_id', deleteComentById).
    patch('/:comment_id', patchCommnetById)

module.exports = commentsRouter;