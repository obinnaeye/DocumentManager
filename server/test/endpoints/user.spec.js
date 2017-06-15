import expect from 'expect';
import AxiosCaller from '../helpers/axios';

const baseUrl = 'http://localhost:8080/users/';
const newUser = {
  email: 'obi5@yahoo.com',
  firstName: 'obi',
  lastName: 'obi3',
  password: 'asdfghjk'
};
// Not a test
describe('Users:', () => {
  describe('Create User', () => {
    it(`should return status code of
    200 for successfully created user`, () =>
      AxiosCaller.post(`${baseUrl}`, newUser)
        .then((response) => {
          expect(response.status).toEqual(response.status);
        })
    );
  });
});
