import url from '../helper/constant';

module.exports = {
  'Login Users': (browser) => {
    browser
      .url(url.signin)
      .waitForElementVisible('body')
      .assert.containsText('h3', 'Signin Here:')
      .setValue('input[type=email]', 'info@okdocs.com')
      .setValue('input[type=password]', 'asdfghjk')
      .click('input[type=submit]')
      .execute('Materialize.Toast.removeAll()')
      .waitForElementVisible('a[id=logout]')
      .assert.urlContains('dashboard')
      .click('#editprofile')
      .waitForElementVisible('input[id=firstName]')
      .pause(2000)
      .assert.value('input[id="firstName"]', 'Info')
      .click('a[id=logout]')
      .waitForElementPresent('a[id=signin]')
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
      .assert.urlEquals(url.signin)
      .end();
  }
};
