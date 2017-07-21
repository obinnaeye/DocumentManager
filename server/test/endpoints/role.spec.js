/* global before after */
import supertest from 'supertest';
import { expect } from 'chai';
import database from '../../models';
import app from '../../../server';
import SpecHelper from '../helpers/SpecHelper';
import SeedHelper from '../helpers/SeedHelper';

const client = supertest.agent(app);

describe('Roles:', () => {
  const adminUser = { ...SpecHelper.validAdminUser };
  const regularUser = SpecHelper.generateRandomUser(2);
  before((done) => {
    SeedHelper.init()
    .then(() => {
      client.post('/users/login')
      .send({
        email: adminUser.email,
        password: adminUser.password
      })
      .end((error, response) => {
        adminUser.token = response.body.activeToken;
        adminUser.id = response.body.userId;
        client.post('/users')
        .send(regularUser)
        .end((error1, response1) => {
          regularUser.token = response1.body.activeToken;
          regularUser.id = response1.body.userId;
          done();
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

  describe('Create Role', () => {
    const newRole = SpecHelper.generateRandomRole('ttl');
    it('should allow an Admin user with VALID token create a Role',
    (done) => {
      client.post('/roles')
      .set({ 'xsrf-token': adminUser.token })
      .send(newRole)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal(newRole.title);
        done();
      });
    });

    it(`should return status code 400 if an Admin tries
    to create a new Role with the Role ID specified`,
    (done) => {
      const invalidNewRole = SpecHelper.generateRandomRole('d0');
      invalidNewRole.id = 1;
      client.post('/roles')
      .send(invalidNewRole)
      .set({ 'xsrf-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });

    it(`should return status code 400 (Bad Request) when an admin
      tries to create a role without specifying role title`,
    (done) => {
      client.post('/roles')
      .set({ 'xsrf-token': adminUser.token })
      .send({})
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });
  });

  describe('Get Roles', () => {
    it('should allow an Admin User with VALID token get a specific Role by id',
    (done) => {
      client.get('/roles/2')
      .set({ 'xsrf-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.title).to.oneOf(['admin', 'regular', 'random']);
        done();
      });
    });

    it('should allow specifying offset when fetching Roles', (done) => {
      const searchOffset = 1;
      client.get(`/roles/?offset=${searchOffset}`)
      .set({ 'xsrf-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.rows[0].title).to.be.oneOf(['admin', 'regular']);
        done();
      });
    });

    it(`should return a 400(Bad Request) status code when an 
    invalid offset is specified`,
    (done) => {
      const invalidSearchOffset = -1;
      client.get(`/roles/?offset=${invalidSearchOffset}`)
      .set({ 'xsrf-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });

    it('should NOT allow an Admin User get a non-existing Role',
    (done) => {
      client.get('/roles/9119')
      .set({ 'xsrf-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
    });

    it(`should NOT allow a Non Admin User with VALID token
    access a specific Role`,
    (done) => {
      client.get('/roles/2')
      .set({ 'xsrf-token': regularUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        done();
      });
    });

    it('should allow an Admin User with VALID token get all Roles',
    (done) => {
      client.get('/roles')
      .set({ 'xsrf-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.rows[0].title).to.be.oneOf(['admin', 'regular', 'random', 'ttl']);
        done();
      });
    });

    it('should NOT allow a Non-Admin User with VALID token get all Roles',
    (done) => {
      client.get('/roles')
      .set({ 'xsrf-token': regularUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        done();
      });
    });
  });

  describe('Update Role', () => {
    const newRole = SpecHelper.generateRandomRole('update');
    before((done) => {
      client.post('/roles')
      .send(newRole)
      .set({ 'xsrf-token': adminUser.token })
      .end((error, response) => {
        newRole.id = response.body.id;
        done();
      });
    });

    it('should allow an Admin user to UPDATE a Role',
    (done) => {
      const newTitle = 'new title';
      client.put(`/roles/${newRole.id}`)
      .set({ 'xsrf-token': adminUser.token })
      .send({ title: newTitle })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Update Successful');
        done();
      });
    });

    it('should NOT allow an Admin user to Update a non-existing Role',
    (done) => {
      const newTitle = 'new title1';
      client.put(`/roles/${911911}`)
      .set({ 'xsrf-token': adminUser.token })
      .send({ title: newTitle })
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
    });

    it('should NOT allow update of a Role ID',
    (done) => {
      client.put(`/roles/${3}`)
      .set({ 'xsrf-token': adminUser.token })
      .send({ id: 5 })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Role ID Can not be Updated!');
        done();
      });
    });

    it('should NOT allow update of admin Role',
    (done) => {
      const newTitle = 'new title1';
      client.put(`/roles/${1}`)
      .set({ 'xsrf-token': adminUser.token })
      .send({ title: newTitle })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal(
          'Protected Roles can not be Updated!');
        done();
      });
    });

    it('should NOT allow update of regular Role', (done) => {
      const newTitle = 'new title1';
      client.put(`/roles/${2}`)
      .set({ 'xsrf-token': adminUser.token })
      .send({ title: newTitle })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal(
          'Protected Roles can not be Updated!');
        done();
      });
    });
  });

  describe('Delete Role', () => {
    it('should NOT allow a Non-Admin User delete a Role',
    (done) => {
      client.delete('/roles/1')
      .set({ 'xsrf-token': regularUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        done();
      });
    });

    it('should allow an Admin user with VALID token delete a Role',
    (done) => {
      client.delete('/roles/3')
      .set({ 'xsrf-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });

    it(`should NOT allow an Admin user with VALID token delete a
    non-existing Role`, (done) => {
      client.delete('/roles/911911')
      .set({ 'xsrf-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
    });
  });
});
