/* global before after */
import supertest from 'supertest';
import { expect } from 'chai';
import findIndex from 'lodash/findIndex';
import app from '../../../server';
import database from '../../models';
import SpecHelper from '../helpers/SpecHelper';
import SeedHelper from '../helpers/SeedHelper';

const client = supertest.agent(app);

describe('Documents:', () => {
  const adminUser = { ...SpecHelper.validAdminUser };
  const regularUser1 = SpecHelper.generateRandomUser(2);
  const regularUser2 = SpecHelper.generateRandomUser(2);
  const regularUser3 = SpecHelper.generateRandomUser(2);
  const userWithoutDocument = SpecHelper.generateRandomUser(2);
  before((done) => {
    // generate regular and admin user data after clearing database
    SeedHelper.init()
    .then(() => {
      // login admin
      client.post('/users/login')
      .send({
        email: adminUser.email,
        password: adminUser.password
      })
      .end((error, response) => {
        // set admin token and id
        adminUser.token = response.body.activeToken;
        adminUser.id = response.body.userId;
        // fetch regularUser1 details
        client.post('/users')
        .send(regularUser1)
        .end((error1, response1) => {
          regularUser1.token = response1.body.activeToken;
          regularUser1.id = response1.body.userId;
          // fetch regularUser2 details
          client.post('/users')
          .send(regularUser2)
          .end((error2, response2) => {
            regularUser2.token = response2.body.activeToken;
            regularUser2.id = response2.body.userId;
            client.post('/users')
            .send(regularUser3)
            .end((error3, response3) => {
              regularUser3.token = response3.body.activeToken;
              regularUser3.id = response3.body.userId;
              client.post('/users')
              .send(userWithoutDocument)
              .end((error4, response4) => {
                userWithoutDocument.token = response4.body.activeToken;
                userWithoutDocument.id = response4.body.userId;
                done();
              });
            });
          });
        });
      });
    });
  });

  after((done) => {
    database.sequelize.sync({ force: true })
    .then(() => {
      done();
    });
  });

  describe('Post', () => {
    it('should create a new Document if title and content are provided',
    (done) => {
      const publicDocument = SpecHelper.generateRandomDocument('public');
      client.post('/documents')
      .send(publicDocument)
      .set({ 'xsrf-token': regularUser1.token })
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.createdAt).to.not.equal(undefined);
        expect(response.body.title).to.equal(publicDocument.title);
        done();
      });
    });

    it(`should override docuement id and go ahead to create a
    document if the document ID is specified`,
    (done) => {
      const publicDocument = SpecHelper.generateRandomDocument('public');
      publicDocument.id = 1;
      client.post('/documents')
      .send(publicDocument)
      .set({ 'xsrf-token': regularUser1.token })
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal(publicDocument.title);
        expect(response.body.id).to.not.equal(publicDocument.id);
        done();
      });
    });

    it(`should allow user with valid access token to create new
    document`, (done) => {
      const roleDocument = SpecHelper.generateRandomDocument('role');
      client.post('/documents')
      .send(roleDocument)
      .set({ 'xsrf-token': regularUser1.token })
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal(roleDocument.title);
        done();
      });
    });

    it(`should not allow user with invalid access token to create new
    document`, (done) => {
      const roleDocument = SpecHelper.generateRandomDocument('role');
      client.post('/documents')
      .send(roleDocument)
      .set({ 'xsrf-token': 'invalidtoken' })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.text).to.equal('Invalid User Authentication Token!');
        done();
      });
    });

    it('should override access type if invalid access type is supplied',
    (done) => {
      const roleDocument = SpecHelper.generateRandomDocument('role');
      roleDocument.access = 'privatee';
      client.post('/documents')
      .send(roleDocument)
      .set({ 'xsrf-token': regularUser1.token })
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal(roleDocument.title);
        expect(response.body.access).to.not.equal(roleDocument.access);
        done();
      });
    });

    it(`should NOT allow creation of a Document if title
    is missing`, (done) => {
      client.post('/documents')
      .send({ content: 'My new content' })
      .set({ 'xsrf-token': regularUser1.token })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Please supply document title');
        done();
      });
    });

    it(`should NOT allow creation of a Document if content
    is missing`, (done) => {
      client.post('/documents')
      .send({ title: 'My new title' })
      .set({ 'xsrf-token': regularUser1.token })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Document should have content');
        done();
      });
    });


    // create duplicate document here for next test
    let duplicateDocument;
    it(`should set the Document access to public by default
     if no access is specified`, (done) => {
      const defaultDocument = SpecHelper.generateRandomDocument();
      duplicateDocument = defaultDocument;
      client.post('/documents')
      .send(defaultDocument)
      .set({ 'xsrf-token': regularUser1.token })
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.access).to.equal('public');
        done();
      });
    });

    it(`should not allow creation of duplicate document title
    belonging to the same owner`, (done) => {
      client.post('/documents')
      .send(duplicateDocument)
      .set({ 'xsrf-token': regularUser1.token })
      .end((error, response) => {
        expect(response.status).to.equal(409);
        expect(response.body.message).to.equal(
        `${duplicateDocument.title} already exist, choose a different title!`);
        done();
      });
    });
  });

  describe('GET', () => {
    // initialize documents neeeded for test
    const privateDocument = SpecHelper.generateRandomDocument('private');
    const publicDocument = SpecHelper.generateRandomDocument('public');
    const roleDocument = SpecHelper.generateRandomDocument('role');
    before((done) => {
      privateDocument.owner = regularUser1;
      // fetch private document data
      client.post('/documents')
      .send(privateDocument)
      .set({ 'xsrf-token': privateDocument.owner.token })
      .end((error, response) => {
        privateDocument.id = response.body.id;
        // fetch public document data
        publicDocument.owner = regularUser2;
        client.post('/documents')
        .send(publicDocument)
        .set({ 'xsrf-token': publicDocument.owner.token })
        .end((error1, response1) => {
          publicDocument.id = response1.body.id;
          // fetch role document data
          roleDocument.owner = regularUser3;
          client.post('/documents')
          .send(roleDocument)
          .set({ 'xsrf-token': roleDocument.owner.token })
          .end((error2, response2) => {
            roleDocument.id = response2.body.id;
            done();
          });
        });
      });
    });

    describe('User Documents:', () => {
      it(`should allow the owner of a private document access to the
      document`, (done) => {
        client.get(`/documents/${privateDocument.id}`)
        .set({ 'xsrf-token': privateDocument.owner.token })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.title)
            .to.equal(privateDocument.title);
          expect(response.body.content)
            .to.equal(privateDocument.content);
          done();
        });
      });

      it(`should allow an authenticated user access all document 
        belonging to him/her public documents`,
      (done) => {
        client.get(`/users/${regularUser3.id}/documents`)
        .set({ 'xsrf-token': regularUser3.token })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          const documents = response.body;
          documents.forEach((document) => {
            expect(document.onwerId).to.equal(regularUser3.userId);
          });
          done();
        });
      });

      it('should return 404 if user has not created any document',
      (done) => {
        client.get(`/users/${userWithoutDocument.id}/documents`)
        .set({ 'xsrf-token': userWithoutDocument.token })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          expect(response.body.message).to.equal(
            'You do not have any document');
          done();
        });
      });

      it('should NOT allow a user access to other user\'s documents',
      (done) => {
        client.get(`/users/${regularUser1.id}/documents`)
        .set({ 'xsrf-token': userWithoutDocument.token })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal(
            'User ID does not match id in uri params');
          done();
        });
      });
    });

    describe('All Documents:', () => {
      it(`should allow a regular User with valid authentication token access to
      only all public documents and only the User private Documents`,
      (done) => {
        client.get('/documents')
        .set({ 'xsrf-token': regularUser1.token })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          const documents = response.body.rows;
          documents.forEach((document) => {
            expect(document.access).to.be.oneOf(['role', 'private', 'public']);
            // check that only the user private documents are returned
            if (document.access === 'private') {
              expect(document.ownerId).to.equal(regularUser1.id);
            }
          });
          done();
        });
      });

      it(`should allow only an Admin User with valid authentication token access
      to all Documents irrespectie of the Documents access type`, (done) => {
        client.get('/documents')
        .set({ 'xsrf-token': adminUser.token })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          const documents = response.body.rows;
          documents.forEach((document) => {
            expect(document.access).to.be.oneOf(['role', 'private', 'public']);
          });
          const privateIndex = findIndex(
              documents, { access: 'private' }
              );
          expect(privateIndex).to.be.gt(-1);
          const roleIndex = findIndex(
              response.body.rows, { access: 'role' }
              );
          expect(roleIndex).to.be.gt(-1);
          const publicIndex = findIndex(
              response.body.rows, { access: 'public' }
              );
          expect(publicIndex).to.be.gt(-1);
          done();
        });
      });

      it('should allow specifying offset when fetching documents', (done) => {
        const searchOffset = 1;
        client.get(`/documents/?offset=${searchOffset}`)
        .set({ 'xsrf-token': adminUser.token })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.be.instanceof(Object);
          expect(+(response.body.offset)).to.equal(searchOffset);
          done();
        });
      });

      it(`should handle invalid offsets specified when fetching users
      and return a 400 (bad request) status code`,
      (done) => {
        const invalidSearchOffset = -1;
        client.get(`/documents/?offset=${invalidSearchOffset}`)
        .set({ 'xsrf-token': adminUser.token })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal(
            'Invalid offset; offset should not be less than 1'
          );
          done();
        });
      });

      it(`should handle invalid limit specified when fetching users
      and return a 400 (bad request) status code`,
      (done) => {
        const invalidSearchLimit = -1;
        client.get(`/documents/?limit=${invalidSearchLimit}`)
        .set({ 'xsrf-token': adminUser.token })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal(
            'Invalid limit; limit should not be less than 1'
          );
          done();
        });
      });

      it('should allow specifying limit when fetching documents', (done) => {
        const searchLimit = 1;
        client.get(`/documents/?limit=${searchLimit}`)
        .set({ 'xsrf-token': adminUser.token })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.rows.length).to.equal(1);
          expect(+(response.body.limit)).to.equal(searchLimit);
          done();
        });
      });
    });

    describe('Single Document:', () => {
      it(`should allow the onwer access to the
        document`, (done) => {
        client.get(`/documents/${privateDocument.id}`)
        .set({ 'xsrf-token': privateDocument.owner.token })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.title)
            .to.equal(privateDocument.title);
          done();
        });
      });

      it('should return 400 if Document id is not a number',
    (done) => {
      const titleUpdate = 'Does not exist';
      client.get('/documents/tyr')
      .set({ 'xsrf-token': adminUser.token })
      .send({ title: titleUpdate })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Document id should be number!');
        done();
      });
    });

      it(`should allow the admin User access to any
        document`, (done) => {
        client.get(`/documents/${privateDocument.id}`)
        .set({ 'xsrf-token': adminUser.token })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.title)
            .to.equal(privateDocument.title);
          done();
        });
      });

      it(`should NOT allow regular User access to other user's private
        document`, (done) => {
        client.get(`/documents/${privateDocument.id}`)
        .set({ 'xsrf-token': userWithoutDocument.token })
        .end((error, response) => {
          expect(response.status).to.equal(403);
          expect(response.body.message).to.equal(
            'You do not have the right access to this document'
          );
          done();
        });
      });

      it('should return 404 if no docuemnt exists with the given id',
      (done) => {
        client.get('/documents/911911')
        .set({ 'xsrf-token': adminUser.token })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          done();
        });
      });
    });

    describe('Search:', () => {
      it('should allow regular User search for documents by title',
      (done) => {
        client.get(`/search/documents/?q=${publicDocument.title}`)
          .set({ 'xsrf-token': regularUser1.token })
          .end((error, response) => {
            const index = findIndex(
              response.body.rows, { title: publicDocument.title }
              );
            expect(response.status).to.equal(200);
            expect(response.body.rows.length).to.be.at.least(1);
            expect(response.body.rows[index].title)
              .to.equal(publicDocument.title);
            done();
          });
      });

      it('should allow admin User search for documents by title',
      (done) => {
        client.get(`/search/documents/?q=${publicDocument.title}`)
          .set({ 'xsrf-token': adminUser.token })
          .end((error, response) => {
            const index = findIndex(
              response.body.rows, { title: publicDocument.title }
              );
            expect(response.status).to.equal(200);
            expect(response.body.rows[index].title)
              .to.equal(publicDocument.title);
            done();
          });
      });

      it('should allow search for documents by title',
      (done) => {
        client.get(`/search/documents/?q=${publicDocument.title}`)
          .set({ 'xsrf-token': regularUser1.token })
          .end((error, response) => {
            const index = findIndex(
              response.body.rows, { title: publicDocument.title }
              );
            expect(response.status).to.equal(200);
            expect(response.body.rows.length).to.be.at.least(1);
            expect(response.body.rows[index].title)
              .to.equal(publicDocument.title);
            done();
          });
      });

      it('should return 400 if search string is not provided',
      (done) => {
        client.get('/search/documents/?')
          .set({ 'xsrf-token': regularUser1.token })
          .end((error, response) => {
            expect(response.status).to.equal(400);
            done();
          });
      });
    });
  });

  describe('Update Document', () => {
    // initialize documents needed for test
    const privateDocument = SpecHelper.generateRandomDocument('private');
    const publicDocument = SpecHelper.generateRandomDocument('public');
    const roleDocument = SpecHelper.generateRandomDocument('role');
    // set documents data needed from the server
    before((done) => {
      privateDocument.owner = regularUser1;
      // fetch data for private document
      client.post('/documents')
      .send(privateDocument)
      .set({ 'xsrf-token': privateDocument.owner.token })
      .end((error, response) => {
        privateDocument.id = response.body.id;
        // fetch data for public document
        publicDocument.owner = regularUser2;
        client.post('/documents')
        .send(publicDocument)
        .set({ 'xsrf-token': publicDocument.owner.token })
        .end((error1, response1) => {
          publicDocument.id = response1.body.id;
          // fetch data for role document
          roleDocument.owner = regularUser3;
          client.post('/documents')
          .send(roleDocument)
          .set({ 'xsrf-token': roleDocument.owner.token })
          .end((error2, response2) => {
            roleDocument.id = response2.body.id;
            done();
          });
        });
      });
    });

    it('should allow the Document owner to update the Document', (done) => {
      const titleUpdate = 'My new title';
      client.put(`/documents/${privateDocument.id}`)
      .set({ 'xsrf-token': privateDocument.owner.token })
      .send({ title: titleUpdate })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(titleUpdate);
        done();
      });
    });

    it(`should NOT allow a regular User update another user's
    Document`,
    (done) => {
      const titleUpdate = 'Try update';
      client.put(`/documents/${publicDocument.id}`)
      .set({ 'xsrf-token': roleDocument.owner.token })
      .send({ title: titleUpdate })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        done();
      });
    });

    it(`should allow admin User update a Document belonging to
    another User`,
    (done) => {
      const titleUpdate = 'title Update by an Admin';
      client.put(`/documents/${publicDocument.id}`)
      .set({ 'xsrf-token': adminUser.token })
      .send({ title: titleUpdate })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(titleUpdate);
        done();
      });
    });

    it('should NOT allow non-existing Document to be updated',
    (done) => {
      const titleUpdate = 'Does not exist';
      client.put('/documents/1000')
      .set({ 'xsrf-token': adminUser.token })
      .send({ title: titleUpdate })
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
    });

    it('should return 400 if Document id is not a number',
    (done) => {
      const titleUpdate = 'Does not exist';
      client.put('/documents/tyrt')
      .set({ 'xsrf-token': adminUser.token })
      .send({ title: titleUpdate })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Document id should be number!');
        done();
      });
    });
  });

  describe('Delete Document', () => {
    const privateDocument = SpecHelper.generateRandomDocument('private');
    const publicDocument = SpecHelper.generateRandomDocument('public');
    const roleDocument = SpecHelper.generateRandomDocument('role');
    before((done) => {
      privateDocument.owner = regularUser1;
      client.post('/documents')
      .send(privateDocument)
      .set({ 'xsrf-token': privateDocument.owner.token })
      .end((error, response) => {
        privateDocument.id = response.body.id;
        publicDocument.owner = regularUser2;
        client.post('/documents')
        .send(publicDocument)
        .set({ 'xsrf-token': publicDocument.owner.token })
        .end((error1, response1) => {
          publicDocument.id = response1.body.id;
          roleDocument.owner = regularUser3;
          client.post('/documents')
          .send(roleDocument)
          .set({ 'xsrf-token': roleDocument.owner.token })
          .end((error2, response2) => {
            roleDocument.id = response2.body.id;
            done();
          });
        });
      });
    });

    it('should NOT allow a regular User to delete another user\'s document',
    (done) => {
      // roleDocument has already been deleted in the previous test
      client.delete(`/documents/${publicDocument.id}`)
      .set({ 'xsrf-token': userWithoutDocument.token })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        done();
      });
    });

    it('should allow an Admin User to delete another user\'s document',
    (done) => {
      // roleDocument has already been deleted in the previous test
      client.delete(`/documents/${publicDocument.id}`)
      .set({ 'xsrf-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });

    it(`should allow the owner of a Document with valid token delete the
    Document`, (done) => {
      client.delete(`/documents/${roleDocument.id}`)
      .set({ 'xsrf-token': roleDocument.owner.token })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Document deleted successfully');
        done();
      });
    });

    it(`should return status code 404 (NOT Found) when a user with valid
    access tries to delete a non-existing document`,
    (done) => {
      // roleDocument has already been deleted in the previous test
      client.delete(`/documents/${roleDocument.id}`)
      .set({ 'xsrf-token': roleDocument.owner.token })
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
    });
  });
});
