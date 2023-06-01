const db = require('../db/connection')
const format = require('pg-format')

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

exports.uploadComment = (comment, review_id) => {
    if(!Number(review_id)) {
       return Promise.reject({status: 400, msg: `Review ID "${review_id}" is invalid - use and integer`})
    }
    if(!comment.body){
        return Promise.reject({status: 400, msg:'Comment is missing a body'})
    }
    if(!comment.username){
        return Promise.reject({status: 400, msg:'Comment is missing username'})
    } 
    
    return db.query(`SELECT username FROM users WHERE username = $1`, [comment.username])
    .then( result => result.rows)
    .then( users => {
        if(users.length === 0){
            return Promise.reject({status: 404, msg: `Username "${comment.username}" does not exist`})
        }
        let sql = format(`
            INSERT INTO comments
            (author, body, review_id)
            VALUES
            %L
            RETURNING *;
            `,[[users[0].username, comment.body, review_id]]);

        return db.query(sql)
        .then( result => result.rows[0])
    })
    
}

exports.updateCommentVotes = (comment_id, voteChange) => {

    if(!voteChange.inc_vote){
        return Promise.reject({status: 400, msg: `Key "${Object.keys(voteChange)[0]}" in sent data is not correct - use key "inc_vote"`})
    }
    if(!Number(voteChange.inc_vote)){
        return Promise.reject({status: 400, msg: `Data sent "${voteChange.inc_vote}" is not compatible - use an integer`})
    }
    return db.query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;`, [voteChange.inc_vote, comment_id])
    .then( result => result.rows[0])
    .then( comment => {
        console.log(comment)
        if(!comment){
            return Promise.reject({status: 404, msg: `Comment by by ID "${comment_id}" does not exist!`})
        }
        return comment;
    })
}