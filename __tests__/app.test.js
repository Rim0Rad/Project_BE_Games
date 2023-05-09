const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')

const request = require('supertest')
const app = require('../app')

beforeEach( () => seed(data))
//afterAll( () => db.end())

describe('bad endpoint', () => {
    it('returns 404 when privided a bad endpoint', () => {
        return request(app).get('/api/categoriess').expect(404)
    });
});

describe('/api/categories', () => {
    
    it('returns 200, array of category object containing 4 entries', () => {
        return request(app).get('/api/categories').expect(200)
        .then(ressult => {
            return ressult.body.categories
        })
        .then( categories => {
            expect(categories).toHaveLength(4)
        })
    });

    it('returned categories contain properties: slug, description', ()=> {
        return request(app).get('/api/categories').expect(200)
        .then(ressult => {
            return ressult.body.categories
        })
        .then( categories => {
            categories.forEach( category => {
                expect(category).toHaveProperty('slug')
                expect(category).toHaveProperty('description')
            })
            
        })
    })
});

describe('GET /api', () => {
    it('returns status 200', () => {
        return request(app).get('/api').expect(200)
    })
    it('retunrns an object with available endpoints', () => {
        return request(app).get('/api').
        then( result => {
            expect(typeof result.body).toBe('object')
            expect(result.body).toHaveProperty("GET /api")
            expect(result.body).toHaveProperty("GET /api/categories")
            expect(result.body).toHaveProperty("GET /api/reviews/:review_id")
        })
    })
    it('handles some error?', () => {
        
    });
});

describe('GET /api/reviews/:review_id', () => {
    
    it('returns status 200 and a review object', () => {
        return request(app).get('/api/reviews/1').expect(200)
    });

    it('returned object has correct properties', () => {
        return request(app).get('/api/reviews/1')
        .then( ({ body }) => {
            expect(body.review).toHaveProperty('review_id')
            expect(body.review).toHaveProperty('title')
            expect(body.review).toHaveProperty('review_body')
            expect(body.review).toHaveProperty('designer')
            expect(body.review).toHaveProperty('review_img_url')
            expect(body.review).toHaveProperty('votes')
            expect(body.review).toHaveProperty('category')
            expect(body.review).toHaveProperty('owner')
            expect(body.review).toHaveProperty('created_at')
        })
    });
    it('returned object has correct data', () => {
        return request(app).get('/api/reviews/2')
        .then( ({body}) => {
            expect(body.review.review_id).toBe(2)
            expect(body.review.title).toBe('Jenga')
            expect(body.review.designer).toBe('Leslie Scott')
            expect(body.review.owner).toBe('philippaclaire9')
            expect(body.review.review_img_url).toBe('https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700')
            expect(body.review.review_body).toBe('Fiddly fun for all the family')
            expect(body.review.category).toBe('dexterity')
            expect(body.review.votes).toBe(5)
            //expect(result.body.created_at).toBe(?)
        })
    });

    it('returns 404 when given bad id', () => {
        return request(app).get('/api/reviews/124124214').expect(404)
    })
    
});

describe('500 Internal Server Error', () => {
    it('returns 500 for internal server error', () => {
        if(db) db.end()
        return request(app).get('/api/categories').expect(500)
    });
});