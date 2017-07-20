import url from './constant';

module.exports = {
  'Login Users': (browser) => {
    browser
      .url(url.signin)
      .waitForElementVisible('body')
      .assert.containsText('h3', 'Signin Here:')
      .setValue('input[type=email]', 'info@okdocs.com')
      .setValue('input[type=password]', 'asdfghjk')
      .click('input[type=submit]')
      .pause(2000)
      .assert.urlContains('dashboard')
      .click('#editprofile')
      .click('a[id=logout]')
      .waitForElementVisible('header')
      .pause(5000)
      .assert.urlEquals('http://localhost:8080/?#/')
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
