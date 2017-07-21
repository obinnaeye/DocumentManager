import faker from 'faker';
import url from '../helper/constant';

module.exports = {
  'Signup Users': (browser) => {
    browser
      .url(url.signup)
      .waitForElementVisible('body')
      .assert.containsText('h3', 'Signup Here:')
      .click('input[type=submit]')
      .pause(2000)
      .assert.urlContains('signup')
      .setValue('input[id=firstName]', faker.name.firstName())
      .click('input[type=submit]')
      .pause(2000)
      .assert.urlContains('signup')
      .setValue('input[id=lastName]', faker.name.lastName())
      .click('input[type=submit]')
      .pause(2000)
      .assert.urlContains('signup')
      .setValue('input[id="email"]', faker.internet.email())
      .setValue('input[id="password"]', 'password')
      .setValue('input[id="passwordConfirm"]', 'password')
      .click('input[type=submit]')
      .waitForElementVisible('a[id=logout]')
      .assert.urlContains('dashboard')
      .end();
  }
};
