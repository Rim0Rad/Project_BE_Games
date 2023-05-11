const db = require('../db/connection.js')
const format = require('pg-format')

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