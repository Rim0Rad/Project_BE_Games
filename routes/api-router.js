const apiRouter = require('express').Router();
const { getApi } = require('../controllers/api.controller.js');
const  categoriesRouter = require('./categories-router.js');
const reviewRouter = require('./reviewRouter-router.js')
const usersRouter = require('./usersRouter.js')
const commentsRouter = require('./commentsRouter.js')

apiRouter.get('/', getApi)

apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/reviews', reviewRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/comments', commentsRouter)


module.exports = apiRouter;