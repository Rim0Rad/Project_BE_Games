const db = require('../db/connection')
const format = require('pg-format')
const { fetchCategories } = require('./categories.module')

exports.fetchReviewByID = (id) => {
    if(!Number(id)) return Promise.reject({status: 400, msg: `ID '${id}' is invalid`})

    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then(result => result.rows[0])
    .then( review => {
        if(!review){
            return Promise.reject({status: 404, msg: `Review by ID ${id} does not exist`})
        }
        return db.query(`SELECT COUNT(review_id) FROM comments WHERE review_id = $1;`, [review.review_id])
        .then(result => result.rows[0].count)
        .then( count => {
            review.comment_count = Number(count)
            return review
         })
    })
}

exports.fetchReviewComments = (id) => {
    return this.fetchReviewByID(id)
    .then( review => {
        return db.query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`, [review.review_id])
    })
    .then( result => result.rows)
}

exports.fetchReviews = (category = null, sort_by = 'created_at', order = 'DESC') => {

    const acceptableOrderQuery = [ 'ASC', 'DESC'];
    const acceptedSortBy = ['owner', 'title','review_id','category','review_img_url','created_at','votes','designer']
    
    if(!acceptedSortBy.includes(sort_by)){
        return Promise.reject({status: 400, msg: `Parameter sort_by value "${sort_by}" is invalid`})
    }
    if(!acceptableOrderQuery.includes(order.toUpperCase())){
        return Promise.reject({status: 400, msg: `Parameter order value "${order}" is invalid`})
    }
    
    return fetchCategories()
    .then( categories => {
        if(category && !categories.some( cat => { return cat.slug === category })){
            return Promise.reject({status: 404, msg: `Category "${category}" does not exist`})
        }

        let sql = 'SELECT owner,title,review_id,category,review_img_url,created_at,votes,designer,review_body FROM reviews'
        if(category){
            sql += format(` WHERE category = %L`, category)
        }
        sql = format(sql + " ORDER BY %s %s", sort_by, order)

        return db.query(sql)
    })
    .then( result => result.rows)
    .then( reviews => {
        // Count the number of comments on the review
        if(reviews){
            const promises = []
            for(let i = 0; i < reviews.length; i++){
                promises.push(db.query(`SELECT COUNT(review_id) FROM comments WHERE review_id = $1;`, [reviews[i].review_id])
                .then(result => result.rows[0].count)
                .then( count => {
                    reviews[i].comment_count = Number(count)
                }))
            }
            return Promise.all(promises)
            .then( () =>  reviews)
        }
        return reviews
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