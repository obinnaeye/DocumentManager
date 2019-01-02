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
let adminUserPassword;
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
        regularUserToken = response.body.activeToken;
        regularUserId = response.body.userId;
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
    it(`should return http code 200
      if a Regular User is successfully created`, (done) => {
      client.post('/users/')
      .send(newRegularUser)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });

    it('should return a TOKEN if a Regular User is successfully created',
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

    it(`should override provided ID if User ID is specified
    in new User to be created`,
    (done) => {
      const invalidNewUser = SpecHelper.generateRandomUser(2);
      invalidNewUser.id = 3;
      client.post('/users/')
      .send(invalidNewUser)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message)
        .to.equal('You have successfully signed up!');
        expect(response.body.userId).to.not.equal(invalidNewUser.id);
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

    it('should not allow password to be less than 8 characters',
    (done) => {
      const user = SpecHelper.generateRandomUser(2);
      user.password = 'less';
      client.post('/users')
      .send(user)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          'Password should be between 8 and 50 letters');
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
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('userId');
        done();
      });
    });

    it(`should throw an error if invalid email for user
      is supplied`, (done) => {
      const newUser = SpecHelper.generateRandomUser();
      newUser.email = 'newField';
      client.post('/users')
      .send(newUser)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body[0].message).to.equal('Email address is invalid');
        done();
      });
    });

    it(`should still create a regular user if the User specify an invalid
    Role id, Role id is 2 by default.`, (done) => {
      client.post('/users')
      .send(SpecHelper.generateRandomUser(10))
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('userId');
        done();
      });
    });
  });

  describe('Login:', () => {
    it('should allow login for CORRECT details of an Admin User',
    (done) => {
      const { email, password } = SpecHelper.validAdminUser;
      client.post('/users/login')
      .send({
        email,
        password
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('userId');
        expect(response.body.email).to.equal(email);
        done();
      });
    });

    it('should return a TOKEN if Admin Login is successful', (done) => {
      const { password } = SpecHelper.validAdminUser;
      client.post('/users/login')
      .send({
        email: SpecHelper.validAdminUser.email,
        password
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('activeToken');
        // set the admin user token for other tests
        adminUserToken = response.body.activeToken;
        adminUserPassword = password;
        done();
      });
    });

    it('should allow login for CORRECT details of a Regular User',
    (done) => {
      const { email, password } = SpecHelper.validRegularUser;
      client.post('/users/login')
      .send({
        email,
        password
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.email).to.equal(email);
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
        expect(response.body.email).to.equal(SpecHelper.validRegularUser.email);
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
        expect(decodedToken.email).to.equal(SpecHelper.validRegularUser.email);
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

    it('should NOT allow login if email is not provided',
    (done) => {
      client.post('/users/login')
      .send({
        email: SpecHelper.validRegularUser.password
      })
      .end((error, response) => {
        expect(response.status).to.equal(400);
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

  describe('Logout', () => {
    const newRegularUser = SpecHelper.generateRandomUser(2);
    before((done) => {
      client.post('/users')
      .send(newRegularUser)
      .end((error, response) => {
        newRegularUser.token = response.body.activeToken;
        newRegularUser.id = response.body.userId;
        done();
      });
    });

    it('should Fail to Logout a Regular User with an invalid token',
    (done) => {
      client.post('/users/logout')
      .set({ 'xsrf-token': 'aninvalidtoken' })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });

    it('should Successfully Logout a Regular User with a valid token',
    (done) => {
      client.post('/users/logout')
      .set({ 'xsrf-token': newRegularUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Logout Successful');
        done();
      });
    });
  });

  describe('Get Users:', () => {
    it('should allow a regular user with a valid token access to list of users',
    (done) => {
      client.get('/users')
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.instanceof(Object);
        expect(response.body.rows.length).to.be.gt(0);
        expect(response.body).to.have.property('limit');
        expect(response.body).to.have.property('offset');
        done();
      });
    });

    it('should Allow an Admin User access to list of all Users', (done) => {
      client.get('/users')
      .set({ 'xsrf-token': adminUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.rows.length).to.be.gt(0);
        expect(response.body).to.have.property('limit');
        expect(response.body).to.have.property('offset');
        done();
      });
    });

    it('should not allow invalid user access to list of Users', (done) => {
      client.get('/users')
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });

    it('should allow specifying offset when fetching Users', (done) => {
      const searchOffset = 2;
      client.get(`/users/?offset=${searchOffset}`)
      .set({ 'xsrf-token': adminUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.instanceof(Object);
        expect(+(response.body.offset)).to.equal(searchOffset);
        done();
      });
    });

    it('should return 400 if offset if less than 0', (done) => {
      const searchOffset = -2;
      client.get(`/users/?offset=${searchOffset}`)
      .set({ 'xsrf-token': adminUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });

    it('should allow specifying limit when fetching Users', (done) => {
      const searchLimit = 2;
      client.get(`/users/?limit=${searchLimit}`)
      .set({ 'xsrf-token': adminUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect((response.body)).to.be.instanceof(Object);
        expect(+(response.body.limit)).to.equal(2);
        done();
      });
    });

    it('should return 400 if limit if less than 0', (done) => {
      const searchLimit = -2;
      client.get(`/users/?limit=${searchLimit}`)
      .set({ 'xsrf-token': adminUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });
  });

  describe('Get User', () => {
    it('should allow NON-Admin  User with valid token fetch another User',
    (done) => {
      client.get(`/users/${regularUserId + 1}`)
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.userId).to.equal(regularUserId + 1);
        done();
      });
    });

    it('should Allow an Admin User with valid token fetch another User',
    (done) => {
      client.get(`/users/${regularUserId}`)
      .set({ 'xsrf-token': adminUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.userId).to.equal(regularUserId);
        done();
      });
    });

    it(`should return a 400 status code for
      a non integer user id when trying to fetch a user`,
    (done) => {
      client.get('/users/xxx')
      .set({ 'xsrf-token': adminUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Bad Request');
        done();
      });
    });

    it(`should return a 400 status code for an invalid
      integer user id when trying to fetch a user`,
    (done) => {
      client.get('/users/979')
      .set({ 'xsrf-token': adminUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('User not found');
        done();
      });
    });

    it('should Not Allow Un-Authorized user to fetch a user', (done) => {
      client.get('/users/1')
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.text).to.equal('Please provide Authentication Token');
        done();
      });
    });
  });

  describe('Search Users:', () => {
    it('should search for Users by firstName',
    (done) => {
      const query = regularUser.firstName;
      client.get(`/search/users/?q=${query}`)
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.instanceof(Object);
        done();
      });
    });

    it('should search for Users by lastName',
    (done) => {
      const query = regularUser.lastName;
      client.get(`/search/users/?q=${query}`)
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.instanceof(Object);
        done();
      });
    });

    it('should search for Users by email',
    (done) => {
      const query = regularUser.email;
      client.get(`/search/users/?q=${query}`)
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.instanceof(Object);
        done();
      });
    });

    it('should return status code of 400 if no search query is supplied',
    (done) => {
      const query = '';
      client.get(`/search/users/?q=${query}`)
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });
  });

  describe('Update User: ', () => {
    it('should NOT allow update of unexisting user', (done) => {
      client.put(`/users/${regularUserId + 911911}`)
      .set({ 'xsrf-token': adminUserToken })
      .send({ password: 'new password' })
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
    });

    it('should NOT allow a User to update another User profile', (done) => {
      client.put(`/users/${regularUserId + 1}`)
      .set({ 'xsrf-token': regularUserToken })
      .send({ password: 'new password' })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        done();
      });
    });

    it(`should NOT Allow a User Update his password with a
    password that is less than the minimum password length of 8`,
    (done) => {
      const shortPassword = '123';
      client.put(`/users/${regularUserId}`)
      .send({
        password: shortPassword
      })
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });

    it(`should NOT Allow a User to Update password with a
    password that is more than the maximum password length`,
    (done) => {
      const longPassword = `jndghjndmcxfghgggbjknmdcghjn
      gggmdcgdghvbjdcjndfghvbjdncsghbjdsghvbghjndmcxfhvjn dsghvbjndsjghgggb`;
      client.put(`/users/${regularUserId}`)
      .send({
        password: longPassword
      })
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });

    it(`should Allow a User Update his password if a valid Token is provided
      and the new password length is between 8 and 50`,
    (done) => {
      // add the new password to the regular userObject
      regularUser.newPassword = 'mynewpassword';
      const oldPassword = regularUser.password;
      client.put(`/users/${regularUserId}`)
      .send({ password: regularUser.newPassword, oldPassword })
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.email).to.equal(regularUser.email);
        done();
      });
    });

    it('should NOT allow a regular User Update to an Admin User',
    (done) => {
      client.put(`/users/${regularUserId}`)
      .send({
        roleId: 1
      })
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        done();
      });
    });

    it('should  NOT allow update of a User ID',
    (done) => {
      client.put(`/users/${regularUserId}`)
      .send({
        id: 4
      })
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });

    it('should  NOT allow update of a User email',
    (done) => {
      client.put(`/users/${regularUserId}`)
      .send({
        email: 'obinna@obinna.com'
      })
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Email Updating Not Allowed');
        done();
      });
    });

    it('should Allow a User Login with the updated password',
    (done) => {
      client.post('/users/login')
      .send({
        email: regularUser.email,
        password: regularUser.newPassword
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.email).to.equal(regularUser.email);
        done();
      });
    });

    it('should NOT Allow a User Login with the old password',
    (done) => {
      client.post('/users/login')
      .send({
        email: regularUser.email,
        password: regularUser.password
      })
      .end((error, response) => {
        expect(response.status).to.equal(422);
        expect(response.body.message).to.equal('Wrong password');
        done();
      });
    });

    it(`should Allow an Admin to update a regular
    User password`,
    (done) => {
      // add the admin set password to the regular user Object
      regularUser.adminSetPassword = 'admin set password';
      const oldPassword = adminUserPassword;
      client.put(`/users/${regularUserId}`)
      .send({
        password: regularUser.adminSetPassword,
        oldPassword
      })
      .set({ 'xsrf-token': adminUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });

    it('should Allow a User Login with the new password updated by an Admin',
    (done) => {
      client.post('/users/login')
      .send({
        email: regularUser.email,
        password: regularUser.adminSetPassword
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.email).to.equal(regularUser.email);

        // update the user token as a new token is always
        // generated on every login
        regularUserToken = response.body.activeToken;
        done();
      });
    });

    it('should NOT allow a User update his profile without a valid Token',
    (done) => {
      client.put(`/users/${regularUserId}`)
      .set({ 'xsrf-token': 'invalidToken' })
      .send({ firstName: 'someOne' })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.text).to.equal('Invalid User Authentication Token!');
        done();
      });
    });
  });

  describe('Logout', () => {
    const newRegularUser = SpecHelper.generateRandomUser(2);
    before((done) => {
      client.post('/users')
      .send(newRegularUser)
      .end((error, response) => {
        newRegularUser.token = response.body.activeToken;
        newRegularUser.id = response.body.userId;
        done();
      });
    });

    it('should Fail to Logout a User with an invalid token',
    (done) => {
      client.post('/users/logout')
      .set({ 'xsrf-token': 'invalidtoken' })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.text).to.equal('Invalid User Authentication Token!');
        done();
      });
    });

    it('should Successfully Logout an Admin User with a valid token',
    (done) => {
      client.post('/users/logout')
      .set({ 'xsrf-token': adminUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });

    it('should Successfully Logout a Regular User with a valid token',
    (done) => {
      client.post('/users/logout')
      .set({ 'xsrf-token': newRegularUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });
  });

  describe('Delete User', () => {
    const currentAdminUser = Object.assign({}, SpecHelper.validAdminUser);
    before((done) => {
      client.post('/users/login')
      .send(currentAdminUser)
      .end((error, response) => {
        currentAdminUser.token = response.body.activeToken;
        currentAdminUser.id = response.body.userId;
        done();
      });
    });

    it(`should NOT allow a Non-Admin User to delete
    another User`,
    (done) => {
      client.delete(`/users/${regularUserId + 1}`)
      .set({ 'xsrf-token': regularUserToken })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        done();
      });
    });

    it('should allow an Admin user to delete another User',
    (done) => {
      client.delete(`/users/${regularUserId}`)
      .set({ 'xsrf-token': currentAdminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done();
      });
    });

    it('should not allow deletion of admin User', (done) => {
      const adminId = currentAdminUser.id;
      client.delete(`/users/${adminId}`)
      .set({ 'xsrf-token': currentAdminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(403);
        done();
      });
    });

    it('should not allow deletion of nonexisting User', (done) => {
      client.delete('/users/911911')
      .set({ 'xsrf-token': currentAdminUser.token })
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
    });
  });
});
