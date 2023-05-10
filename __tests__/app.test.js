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

describe("GET /api/reviews", () => {
  it("returns 200 with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((result) => {
        return result.body.reviews;
      })
      .then((reviews) => {
        expect(Array.isArray(reviews)).toBe(true);
      });
  });
  it("reviews has required properties", () => {
    return request(app)
      .get("/api/reviews")
      .then((result) => {
        return result.body.reviews;
      })
      .then((reviews) => {
        reviews.forEach((review) => {
          expect(review).toHaveProperty("owner");
          expect(review).toHaveProperty("title");
          expect(review).toHaveProperty("review_id");
          expect(review).toHaveProperty("category");
          expect(review).toHaveProperty("review_img_url");
          expect(review).toHaveProperty("created_at");
          expect(review).toHaveProperty("votes");
          expect(review).toHaveProperty("designer");
        });
      });
  });
  it("has property comment_count which is the number of comments with this review_id", () => {
    return request(app)
      .get("/api/reviews")
      .then((result) => {
        return result.body.reviews;
      })
      .then((reviews) => {
        return db
          .query(`SELECT * FROM comments;`)
          .then((result) => result.rows)
          .then((comments) => {
            reviews.forEach((review) => {
              //Calculate comments for each review
              let commentCount = 0;
              comments.forEach((comment) => {
                if (comment.review_id === review.review_id) {
                  commentCount++;
                }
              });

              expect(review).toHaveProperty("comment_count");
              expect(review.comment_count).toBe(commentCount);
            });
          });
      });
  });
  it("does not have a property review_body", () => {
    return request(app)
      .get("/api/reviews")
      .then((result) => result.body.reviews)
      .then((reviews) => {
        reviews.forEach((review) => {
          expect(review).not.toHaveProperty("review_body");
        });
      });
  });

  it("reviews are sorted by data in decending order by default", () => {
    return request(app)
      .get("/api/reviews")
      .then((result) => result.body.reviews)
      .then((reviews) => {
        for (let i = 1; i < reviews.length; i++) {
          expect(Date.parse(reviews[i - 1].created_at)).toBeLessThanOrEqual(
            Date.parse(reviews[i].created_at)
          );
        }
      });
  });
});

/* Stop database and test qurry responses for endpoints*/
describe("500 Internal Server Error", () => {
  it("returns 500 for internal server error", () => {
    if (db) db.end();
    const getCategories = request(app).get("/api/categories").expect(500);
    const getReviews = request(app).get("/api/reviews").expect(500);
    const getReviewsById = request(app).get("/api/reviews/2").expect(500);
    return Promise.all([getCategories, getReviews, getReviewsById]);
  });
});