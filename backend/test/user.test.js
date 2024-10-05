const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); 
const User = require('../models/user-schema');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const { expect } = chai;

describe('User API', function() {
  this.timeout(20000); 

  before((done) => {
    mongoose.connect(process.env.TEST_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => done())
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        done(err);
      });
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  after((done) => {
    mongoose.connection.close((err) => {
      if (err) {
        console.error('Error closing MongoDB connection:', err);
        done(err);
      } else {
        done();
      }
    });
  });

  describe('POST /signup', () => {
    it('should register a new user', (done) => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      chai.request(app)
        .post('/signup')
        .send(newUser)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('newUser');
          expect(res.body.newUser).to.have.property('email').eql('john.doe@example.com');
          done();
        });
    });

    it('should not register a user with an existing email', (done) => {
      const existingUser = new User({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
      });

      existingUser.save().then(() => {
        const newUser = {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          password: 'password1234',
        };

        chai.request(app)
          .post('/signup')
          .send(newUser)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error').eql(true);
            expect(res.body).to.have.property('message').eql('This email address is already registered');
            done();
          });
      }).catch(done);
    });
  });

  describe('POST /login', () => {
    it('should log in an existing user', (done) => {
      const existingUser = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

      existingUser.save().then(() => {
        chai.request(app)
          .post('/login')
          .send({ email: 'john.doe@example.com', password: 'password123' })
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Successfully logged in!');
            expect(res.body).to.have.property('accessToken');
            done();
          });
      }).catch(done);
    });

    it('should return an error if the user does not exist', (done) => {
      chai.request(app)
        .post('/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error').eql(true);
          expect(res.body).to.have.property('message').eql('User not found');
          done();
        });
    });
  });

  describe('GET /get-user', () => {
    it('should return the logged-in user\'s details', (done) => {
      const existingUser = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

      existingUser.save().then(() => {
        const userData = { _id: existingUser._id, email: existingUser.email };
        const token = jwt.sign(userData, process.env.TOKEN, { expiresIn: '3600m' });

        chai.request(app)
          .get('/get-user')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('email').eql(existingUser.email);
            done();
          });
      }).catch(done);
    });
  });
});
