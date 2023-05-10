const db = require('../db/connection')

exports.fetchReviewByID = (id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then(result => result.rows)
    .then( review => {
        if(review.length === 0){
            return Promise.reject({status: 404, msg: "ID does not exist"})
        }
        return review[0]
    })
}

exports.fetchReviews = () => {
    return db.query(`SELECT * FROM reviews ORDER BY created_at;`)
    .then( result => result.rows)
    .then( reviews => {
        return db.query(`SELECT * FROM comments`)
        .then( result => {
            return reviews.map(review => {
                delete review.review_body
                let commentCount = 0;
                result.rows.forEach( comment => {
                    if(comment.review_id === review.review_id){
                        commentCount++
                    }
                })
                review.comment_count = commentCount;
                return review
            })
        })
    })
}