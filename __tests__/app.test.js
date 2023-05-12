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
    it('returns status 404 when given user that does not exist', () => {
        const newComment = {
            username: "AverageUser",
            body: " Best review ever!"
        }
        return request(app).post('/api/reviews/2/comments')
        .send(newComment).expect(404)
        .then( result => result.body)
        .then( err => {
            expect(err.msg).toBe('Username "AverageUser" does not exist')
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
    it('returns status 404 when review by given review id does not exist', () => {
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
    it('returns status 400 when review id is invalid', () => {
        const newComment = {
            username: 'bainesface',
            body:"Well thats not an ID!"
        }
        return request(app).post('/api/reviews/pumpkin/comments')
        .send(newComment).expect(400)
        .then( result => result.body)
        .then( err => {
            expect(err.msg).toBe('Review ID "pumpkin" is invalid - use and integer')
        })
    });
});

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
        .then( result => result.body )
        .then( error => {
            
        })
    })
    it('returns 400 when id is invalid', () => {
        return request(app).get('/api/reviews/pony/comments').expect(400)
        .then( result => result.body )
        .then( error => {
        
        })
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
    const commentCount = [null, 0, 3, 3, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0, 0 ]
    return request(app).get("/api/reviews")
      .then((result) => result.body.reviews)
      .then((reviews) => {
        reviews.forEach((review) => {
            expect(review).toHaveProperty("comment_count");
            expect(review.comment_count).toBe(commentCount[review.review_id]);
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
        expect(reviews).toBeSorted({decending: true, key: 'created_at'})
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  it('returns status 204', () => {
    return request(app).delete('/api/comments/1').expect(204)
  });
  it('comments table will not have the deleted comment', () => {
    return request(app).delete('/api/comments/1')
    .then( result => {
      return db.query(`SELECT * FROM comments WHERE comment_id = 1;`)
    })
    .then( result => result.rows)
    .then( comments => {
      expect(comments).toHaveLength(0)
    })
  });
  it('returns 404 if given id does not exists', () => {
    return request(app).delete('/api/comments/1000').expect(404)
    .then( result => result.body)
    .then( error => {
      expect(error.msg).toBe(`Comment by ID "1000" does not exist`)
    })
  })
  it('returns 400 when provided id is of wrong datatype', () => {
    return request(app).delete('/api/comments/coment').expect(400)
    .then( result => result.body)
    .then( error => {
      expect(error.msg).toBe(`Invalid comment id "coment" - use an integer`)
    })
    
  });
});

describe('PATCH /api/reviews/:review_id', () => {
    it('returns status 200', () => {
        const voteUpdate = {
            inc_vote: 1
        }
        return request(app).patch('/api/reviews/1').send(voteUpdate).expect(200)
    });
    it('returned comment has required properties', () => {
        const voteUpdate = {
            inc_vote: 1
        }
        return request(app).patch('/api/reviews/1').send(voteUpdate)
        .then( result => result.body.review)
        .then( review  => {
            expect(review).toHaveProperty('review_id')
            expect(review).toHaveProperty('title')
            expect(review).toHaveProperty('designer')
            expect(review).toHaveProperty('owner')
            expect(review).toHaveProperty('review_img_url')
            expect(review).toHaveProperty('review_body')
            expect(review).toHaveProperty('category')
            expect(review).toHaveProperty('created_at')
            expect(review).toHaveProperty('votes')
        })
    })
    it('returns updated vote count', () => {
        const voteUpdate = {
            inc_vote: 3
        }
        return request(app).patch('/api/reviews/2').send(voteUpdate)
        .then( result => result.body.review)
        .then( review => {
            expect(review.votes).toBe(8)
        })
    })
    it('returns 404 if review by given index doesn not exist', () => {
        const voteUpdate = {
            inc_vote: 1
        }
        return request(app).patch('/api/reviews/404').send(voteUpdate).expect(404)
        .then(result => {
            expect(result.body.msg).toBe('Review by by ID "404" does not exist!')
        })
    })
    it('returns 400 if provided incorect key', () => {
        const voteUpdate = {
            voting_frode: 1
        }
        return request(app).patch('/api/reviews/1').send(voteUpdate).expect(400)
        .then(result => {
            expect(result.body.msg).toBe('Key "voting_frode" in sent data is not correct - use key "inc_vote"')
        })
    });
    it('returns 400 if provided incorect datatype', () => {
        const voteUpdate = {
            inc_vote: 'apples'
        }
        return request(app).patch('/api/reviews/1').send(voteUpdate).expect(400)
        .then(result => {
            expect(result.body.msg).toBe('Data sent "apples" is not compatible - use an integer')
        })
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