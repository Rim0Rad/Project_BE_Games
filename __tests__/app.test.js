const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')

const request = require('supertest')
const app = require('../app')

beforeEach( () => seed(data))
//afterAll( () => db.end())

describe('bad endpoint', () => {
    it('returns 404 when privided a bad endpoint', () => {
        return request(app).get('/api/categodwadriess').expect(404)
        .then(result => {
            expect(result.body.msg).toBe('Bad Request')
            expect(result.body.status).toBe(404)
        })
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
});

describe("GET /api/reviews/:review_id", () => {
  it("returns status 200", () => {
    return request(app).get("/api/reviews/1").expect(200);
  });

  it("returned object has correct properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .then(({ body }) => {
        expect(body.review).toHaveProperty("review_id");
        expect(body.review).toHaveProperty("title");
        expect(body.review).toHaveProperty("review_body");
        expect(body.review).toHaveProperty("designer");
        expect(body.review).toHaveProperty("review_img_url");
        expect(body.review).toHaveProperty("votes");
        expect(body.review).toHaveProperty("category");
        expect(body.review).toHaveProperty("owner");
        expect(body.review).toHaveProperty("created_at");
      });
  });
  it("returned object has correct data", () => {
    return request(app)
      .get("/api/reviews/2")
      .then(({ body }) => {
        expect(body.review.review_id).toBe(2);
        expect(body.review.title).toBe("Jenga");
        expect(body.review.designer).toBe("Leslie Scott");
        expect(body.review.owner).toBe("philippaclaire9");
        expect(body.review.review_img_url).toBe(
          "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700"
        );
        expect(body.review.review_body).toBe("Fiddly fun for all the family");
        expect(body.review.category).toBe("dexterity");
        expect(body.review.votes).toBe(5);
      });
  });

  it("returns 404 when review by that id does not exist", () => {
    return request(app)
      .get("/api/reviews/124124214")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Review by that ID does not exist");
      });
  });
  it("returns 400 when given invalid id", () => {
    return request(app).get("/api/reviews/hello").expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid Id");
      });
  });
});

/* Responds with:

an array of comments for the given review_id of which each comment should have the following properties:
- comment_id
- votes
- created_at
- author
- body
- review_id
comments should be served with the most recent comments first
 */

describe('GET /api/review/:review_id/comments', () => {
    it('returns status 200', () => {
        return request(app).get('/api/reviews/1/comments').expect(200)
    });
    it('returns and array', () =>{
        return request(app).get('/api/reviews/1/comments')
        .then( result => result.body.comments )
        .then( comments => {
            expect(Array.isArray(comments))
        })
    });
    it('has correct properties ', () => {
        return request(app).get('/api/reviews/2/comments')
        .then( result => result.body.comments )
        .then( comments => {
            comments.forEach( comment => {
                expect(comment).toHaveProperty('comment_id')
                expect(comment).toHaveProperty('votes')
                expect(comment).toHaveProperty('created_at')
                expect(comment).toHaveProperty('author')
                expect(comment).toHaveProperty('body')
                expect(comment).toHaveProperty('review_id')
            })
        })
    }); 
    it('comments are sorted by created_at with acending order', () => {
        return request(app).get('/api/reviews/3/comments')
        .then( result => result.body.comments )
        .then( comments => {
            for(let i = 1; i < comments.length; i++){
                expect(Date.parse(comments[i].created_at)).toBeLessThanOrEqual(Date.parse(comments[i-1].created_at))
            }
        })
    });
    it('returns 404 when id does not match a review', () => {
        return request(app).get('/api/reviews/145151/comments').expect(404)
        .then( result => result.body.comments )
        .then( comments => {
            
        })
    })
    it('returns 400 when id is invalid', () => {
        return request(app).get('/api/reviews/pony/comments').expect(400)
        .then( result => result.body.comments )
        .then( comments => {
        
        })
    });
});


/* SERVER ERROR - server connection is ended therefore this test should run last*/
describe('Server error', () => {
    it("return 500 if server is not responding", () => {
        if(db) db.end()
        return request(app).get('/api/categories').expect(500)
    })
});