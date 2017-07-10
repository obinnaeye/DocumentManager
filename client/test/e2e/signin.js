import url from './constant';

module.exports = {
  'Login Users': (browser) => {
    browser
      .url(url.signin)
      .waitForElementVisible('body')
      .assert.containsText('h3', 'Signin Here:')
      .setValue('input[type=email]', 'admin@okdocs.com')
      .setValue('input[type=password]', 'asdfghjk')
      .click('input[type=submit]')
      .pause(2000)
      .assert.urlContains('dashboard')
      .end();
  },
  'Invalid user': (browser) => {
    browser
      .url(url.signin)
      .waitForElementVisible('body')
      .setValue('input[type=email]', 'invalid@okdocs.com')
      .setValue('input[type=password]', 'password')
      .click('input[type=submit]')
      .pause(2000)
      .assert.urlEquals(url.signin)
      .end();
  }
};
