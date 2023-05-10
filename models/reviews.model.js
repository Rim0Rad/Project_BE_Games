const db = require('../db/connection')

exports.fetchReviewByID = (id) => {
    if(!id) return Promise.reject({status: 400, msg: "Invalid Id"})
    
    return db.query(`SELECT * FROM reviews WHERE review_id = ${id}`)
    .then(result => result.rows)
    .then( review => {
        if(review.length === 0){
            return Promise.reject({status: 404, msg: "Review by that ID does not exist"})
        }
        return review[0]
    })
}

exports.fetchReviews = () => {
    return db.query(`SELECT * FROM reviews ORDER BY created_at;`)
    .then( result => result.rows)
    .then( reviews => {
        return db.query(`SELECT * FROM comments`)
        .then( result => result.rows)
        .then( comments => {
            return reviews.map( review => {
                delete review.review_body
                let commentCount = 0
                comments.forEach( comment => {
                    if(comment.review_id === review.review_id){
                        commentCount++
                    }
                })
                review.comment_count = commentCount
                return review
            })
        })
    })
}