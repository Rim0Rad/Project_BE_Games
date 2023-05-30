const { deleteComentById } = require('../controllers/comments.controller');
const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', deleteComentById);

module.exports = commentsRouter;