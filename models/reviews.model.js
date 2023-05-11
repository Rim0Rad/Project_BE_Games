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

exports.fetchReviewComments = (id) => {
    return this.fetchReviewByID(id)
    .then( review => {
        return db.query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`, [review.review_id])
    })
    .then( result => result.rows)
}

exports.fetchReviews = () => {
    return db.query(`SELECT owner,title,review_id,category,review_img_url,created_at,votes,designer FROM reviews ORDER BY created_at;`)
    .then( result => result.rows)
    .then( reviews => {
        const promises = []
        for(let i = 0; i < reviews.length; i++){
            promises.push(db.query(`SELECT COUNT(review_id) FROM comments WHERE review_id = $1;`, [reviews[i].review_id])
            .then(result => result.rows[0].count)
            .then( count => {
                reviews[i].comment_count = Number(count)
            }))
        }
        return Promise.all(promises)
        .then( result => {
            return reviews
        })
    })
}

exports.updateVotes = (reviewId, voteChange) => {
    if(!voteChange.inc_vote){
        return Promise.reject({status: 400, msg: `Key "${Object.keys(voteChange)[0]}" in sent data is not correct - use key "inc_vote"`})
    }
    if(!Number(voteChange.inc_vote)){
        return Promise.reject({status: 400, msg: `Data sent "${voteChange.inc_vote}" is not compatible - use an integer`})
    }
    return db.query(`
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;`, [voteChange.inc_vote, reviewId])
    .then( result => result.rows[0])
    .then( review => {
        if(!review){
            return Promise.reject({status: 404, msg: `Review by by ID "${reviewId}" does not exist!`})
        }
        return review
    })

}