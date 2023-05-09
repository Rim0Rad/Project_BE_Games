const db = require('../db/connection')

exports.fetchReviewByID = (id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = ${id}`)
    .then(result => result.rows)
    .then( review => {
        if(review.length === 0){
            return Promise.reject({status: 404, msg: "ID does not exist"})
        }
        return review[0]
    })
}