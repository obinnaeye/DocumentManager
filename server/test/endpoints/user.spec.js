/* global before after */
import supertest from 'supertest';
import { expect } from 'chai';
import database from '../../models';
import app from '../../../server';
import SpecHelper from '../helpers/SpecHelper';
import SeedHelper from '../helpers/SeedHelper';

const client = supertest.agent(app);
const regularUser = SpecHelper.generateRandomUser(2);
let regularUserToken;
let adminUserToken;
let regularUserId;

describe('Users:', () => {
  before((done) => {
    SeedHelper.init()
    .then(() => {
      // fetch regular user token and id for further tests
      client.post('/users')
      .send(regularUser)
      .end((error, response) => {
        // set regular user token and id for other tests below
        regularUserToken = response.body.token;
        regularUserId = response.body.id;
        done();
      });
    });
  });

  after((done) => {
    database.sequelize.sync({ force: true })
    .then(() => {
      done();
    });
  });

  describe('Create User', () => {
    const newRegularUser = SpecHelper.generateRandomUser(2);
    it(`should return http code 201
      if a Regular User is successfully created`, (done) => {
      client.post('/users')
      .send(newRegularUser)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });

    it(`should return a 401 status code if User ID is specified
    in new User to be created`,
    (done) => {
      client.post('/users')
      .send(() => {
        // supplying a function makes a call to the api
        // but defining the const in the (done) block fails to make api call
        // don't actually know why
        const invalidNewUser = SpecHelper.generateRandomUser();
        invalidNewUser.id = 1;
        return invalidNewUser;
      })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });

    it('should NOT allow Users with Duplicate Email address to be created',
    (done) => {
      client.post('/users')
      .send(newRegularUser)
      .end((error, response) => {
        expect(response.status).to.equal(409);
        done();
      });
    });

    it('should return a TOKEN if a Regular User if successfully created',
    (done) => {
      client.post('/users')
      .send(SpecHelper.generateRandomUser(2))
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('activeToken');
        done();
      });
    });

    it('should return public details of the created Regular User',
    (done) => {
      client.post('/users')
      .send(SpecHelper.generateRandomUser(2))
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('userId');
        done();
      });
    });

    it('should NOT create a User if Required fields/attributes are missing',
    (done) => {
      const invalidUser = {};
      client.post('/users')
      .send(invalidUser)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });

    it(`should make a User role be regular by default if no roleId
      is supplied`, (done) => {
      client.post('/users')
      .send(SpecHelper.generateRandomUser())
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });

    it(`should create a regular user if the User specify an invalid
    Role id`, (done) => {
      client.post('/users')
      .send(SpecHelper.generateRandomUser(10))
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });
  });

  describe('Login', () => {
    it('should allow login for only CORRECT details of an Admin User',
    (done) => {
      client.post('/users/login')
      .send({
        email: SpecHelper.validAdminUser.email,
        password: SpecHelper.validAdminUser.password
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });

    it('should allow login for only CORRECT details of a Regular User',
    (done) => {
      client.post('/users/login')
      .send({
        email: SpecHelper.validRegularUser.email,
        password: SpecHelper.validRegularUser.password
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });

    it('should return a TOKEN if User Login is successful', (done) => {
      client.post('/users/login')
      .send({
        email: SpecHelper.validRegularUser.email,
        password: SpecHelper.validRegularUser.password
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('activeToken');
        done();
      });
    });

    it('should ensure payload of returned token has User information',
    (done) => {
      client.post('/users/login')
      .send({
        email: SpecHelper.validRegularUser.email,
        password: SpecHelper.validRegularUser.password
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        // decode activeToken
        // Jwt-decoded npm module can equally be used here
        // but this is cleaner without importing extra module
        /* eslint-disable */
        // see https://stackoverflow.com/questions/6182315/how-to-do-base64-encoding-in-node-js
        /* eslint-enable */
        const tokenPayload = response.body.activeToken.split('.')[1];
        const decodedToken = JSON.parse(
          new Buffer(tokenPayload, 'base64').toString()
        );
        expect(decodedToken).to.have.property('userId');
        expect(decodedToken).to.have.property('roleId');
        expect(decodedToken).to.have.property('firstName');
        expect(decodedToken).to.have.property('lastName');
        done();
      });
    });

    it('should NOT return a TOKEN if User Login FAILS', (done) => {
      client.post('/users/login')
      .send({
        email: SpecHelper.validRegularUser.email,
        password: 'wrongpassword'
      })
      .end((error, response) => {
        expect(response.status).to.equal(422);
        expect(response.body.message).to.equal('Wrong password');
        expect(response.body).to.not.have.property('activeToken');
        done();
      });
    });

    it('should NOT allow login for a User that does NOT exist',
    (done) => {
      const nonRegisteredUser = SpecHelper.generateRandomUser(2);
      client.post('/users/login')
      .send({
        email: nonRegisteredUser.email,
        password: nonRegisteredUser.password
      })
      .end((error, response) => {
        expect(response.status).to.equal(422);
        done();
      });
    });

    it('should NOT allow login if password is not provided',
    (done) => {
      client.post('/users/login')
      .send({
        email: SpecHelper.validRegularUser.email
      })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });
  });
});
