const db = require('../db/connection')

exports.fetchReviewByID = (id) => {
    if(!id){
        return Promise.reject({status: 400, msg: "Invalid Id"})
    }
    return db.query(`SELECT * FROM reviews WHERE review_id = ${id}`)
    .then(result => result.rows)
    .then( review => {
        if(review.length === 0){
            return Promise.reject({status: 404, msg: "Review by that ID does not exist"})
        }
        return review[0]
    })
}