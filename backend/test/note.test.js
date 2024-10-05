const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); 
const Note = require('../models/note-schema');
const User = require('../models/user-schema');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const { expect } = chai;

describe('Note API', function() {
  this.timeout(20000); 

  let user, token;

  before((done) => {
    mongoose.connect(process.env.TEST_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        user = new User({
          firstName: 'Test',
          lastName: 'User',
          email: 'test.user@example.com',
          password: 'password123',
        });
        user.save().then((savedUser) => {
          token = jwt.sign({ _id: savedUser._id, email: savedUser.email }, process.env.TOKEN, { expiresIn: '3600m' });
          done();
        });
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        done(err);
      });
  });

  beforeEach(async () => {
    await Note.deleteMany({});
  });

  afterEach(async () => {
    await Note.deleteMany({});
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

  describe('POST /add-note', () => {
    it('should add a new note', (done) => {
      const newNote = {
        title: 'Test Note',
        content: 'This is a test note.',
        tags: ['test', 'note'],
      };

      chai.request(app)
        .post('/add-note')
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('newNote');
          expect(res.body.newNote).to.have.property('title').eql('Test Note');
          done();
        });
    });

    it('should not add a note without a title', (done) => {
      const newNote = {
        content: 'This note has no title.',
        tags: ['no', 'title'],
      };

      chai.request(app)
        .post('/add-note')
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error').eql(true);
          expect(res.body).to.have.property('message').eql('Title is required');
          done();
        });
    });
  });

  describe('PUT /edit-note/:noteId', () => {
    it('should edit an existing note', (done) => {
      const newNote = new Note({
        title: 'Original Note',
        content: 'Original content.',
        tags: ['original'],
        userId: user._id,
      });

      newNote.save().then((savedNote) => {
        const updatedNote = {
          title: 'Updated Note',
          content: 'Updated content.',
        };

        chai.request(app)
          .put(`/edit-note/${savedNote._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updatedNote)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('existingNote');
            expect(res.body.existingNote).to.have.property('title').eql('Updated Note');
            done();
          });
      }).catch(done);
    });

    it('should return an error if the note does not exist', (done) => {
      const updatedNote = {
        title: 'Nonexistent Note',
        content: 'This note does not exist.',
      };

      chai.request(app)
        .put('/edit-note/610c2b1f4a93e9374c36e8b0')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedNote)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error').eql(true);
          expect(res.body).to.have.property('message').eql('Note not found');
          done();
        });
    });
  });

  describe('GET /get-all-notes/', () => {
    it('should retrieve all notes for the authenticated user', (done) => {
      const notes = [
        { title: 'Note 1', content: 'Content 1', userId: user._id },
        { title: 'Note 2', content: 'Content 2', userId: user._id },
      ];

      Note.insertMany(notes).then(() => {
        chai.request(app)
          .get('/get-all-notes/')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('notes').which.is.an('array');
            expect(res.body.notes.length).to.eql(2);
            done();
          });
      }).catch(done);
    });
  });

  describe('DELETE /delete-note/:noteId', () => {
    it('should delete an existing note', (done) => {
      const newNote = new Note({
        title: 'Note to Delete',
        content: 'This note will be deleted.',
        userId: user._id,
      });

      newNote.save().then((savedNote) => {
        chai.request(app)
          .delete(`/delete-note/${savedNote._id}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Note deleted successfully');
            done();
          });
      }).catch(done);
    });

    it('should return an error if the note does not exist', (done) => {
      chai.request(app)
        .delete('/delete-note/610c2b1f4a93e9374c36e8b0')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error').eql(true);
          expect(res.body).to.have.property('message').eql('Note not found');
          done();
        });
    });
  });
});
