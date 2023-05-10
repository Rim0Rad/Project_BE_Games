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

describe('POST /api/reviews/:review_id/comment', () => {
    it('returns status 201', () => {
        const newComment = {
            username: "mallionaire",
            body: " Great game"
        }
        return request(app).post('/api/reviews/1/comments')
        .send(newComment).expect(201)
    });

    it('returns posted comment', () => {
        const newComment = {
            username: "philippaclaire9",
            body: " Best review ever!"
        }
        return request(app).post('/api/reviews/2/comments')
        .send(newComment)
        .then(result => result.body.comment)
        .then( comment => {
            expect(comment).toHaveProperty('comment_id')
            expect(comment).toHaveProperty('body')
            expect(comment).toHaveProperty('review_id')
            expect(comment).toHaveProperty('author')
            expect(comment).toHaveProperty('votes')
            expect(comment).toHaveProperty('created_at')
        })
    });
    it('returns status 400 when given user that does not exist', () => {
        const newComment = {
            username: "AverageUser",
            body: " Best review ever!"
        }
        return request(app).post('/api/reviews/2/comments')
        .send(newComment).expect(400)
        .then( result => result.body)
        .then( err => {
            expect(err.msg).toBe('User does not exist')
        })
    });

    it('returns status 400 when comment is missing body', () => {
        const newComment = {
            username: "dav3rid",
        }
        return request(app).post('/api/reviews/2/comments')
        .send(newComment).expect(400)
        .then( result => result.body)
        .then( err => {
            expect(err.msg).toBe('Comment is missing a body')
        })
    });

    it('returns status 404 when review by given id does not exist', () => {
        const newComment = {
            username: 'bainesface',
            body:"does this review exists?!"
        }
        return request(app).post('/api/reviews/244/comments')
        .send(newComment).expect(404)
        .then( result => result.body)
        .then( err => {
            expect(err.msg).toBe('Review does not exist')
        })
    });
    it('returns status 400 when review is is invalid', () => {
        const newComment = {
            username: 'bainesface',
            body:"Well thats not an ID!"
        }
        return request(app).post('/api/reviews/pumpkin/comments')
        .send(newComment).expect(400)
        .then( result => result.body)
        .then( err => {
            expect(err.msg).toBe('Invalid review ID')
        })
    });
});

describe('Server error', () => {
    it("return 500 if server is not responding", () => {
        if(db) db.end()
        return request(app).get('/api/categories').expect(500)
    })
});