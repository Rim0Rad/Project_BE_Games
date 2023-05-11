const db = require('../db/connection')

exports.removeCommentById = (commentId) => {
    if(!Number(commentId)){
        return Promise.reject({status: 400, msg:`Invalid comment id "${commentId}" - use an integer`})
    }
    return db.query(`
        DELETE FROM comments WHERE comment_id = $1
        RETURNING *;
    `, [commentId])
    .then( result => {
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: `Comment by ID "${commentId}" does not exist`})
        }
    })
}