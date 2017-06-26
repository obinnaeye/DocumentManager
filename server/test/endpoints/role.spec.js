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
    }).catch((error) => {
      console.log('role', error);
      done();
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
        expect(response.status).to.equal(200);
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

    xit('should allow an Admin user with VALID token delete a Role',
    (done) => {
      client.delete('/roles/3')
      .set({ 'x-access-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });

    xit(`should NOT allow an Admin user with VALID token delete a
    non-existing Role`, (done) => {
      client.delete('/roles/100')
      .set({ 'x-access-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
    });

    xit(`should return a 403 status code to show it does NOT allow an
    Admin user with VALID token delete admin Role`, (done) => {
      client.delete('/roles/1')
      .set({ 'x-access-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        done();
      });
    });

    xit(`should return a 403 status code to show it does NOT allow an
    Admin user with VALID token delete regular Role`, (done) => {
      client.delete('/roles/2')
      .set({ 'x-access-token': adminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        done();
      });
    });
  });

});
