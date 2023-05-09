const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')

const request = require('supertest')
const app = require('../app')

beforeEach( () => seed(data))
afterAll( () => db.end())

describe('/api/categories', () => {
    
    it('returns 200, array of category object containing 4 entries', () => {
        return request(app).get('/api/categories').expect(200)
        .then(ressult => {
            return ressult.body
        })
        .then( categories => {
            expect(categories).toHaveLength(4)
        })
    });

    it('returned categories contain properties: slug, description', ()=> {
        return request(app).get('/api/categories').expect(200)
        .then(ressult => {
            return ressult.body
        })
        .then( categories => {
            expect(categories[0]).toHaveProperty('slug')
            expect(categories[0]).toHaveProperty('description')
        })
    })

    it('returns 404 when privided a wrong endpoint', () => {
        return request(app).get('/api/categoriess').expect(404)
    });
});