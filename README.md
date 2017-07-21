[![Build Status](https://travis-ci.org/andela-onnenanya/document-manager.svg?branch=develop)](https://travis-ci.org/andela-onnenanya/document-manager)
[![Code Climate](https://codeclimate.com/github/andela-onnenanya/document-manager/badges/gpa.svg)](https://codeclimate.com/github/andela-onnenanya/document-manager)
[![Coverage Status](https://coveralls.io/repos/github/andela-onnenanya/document-manager/badge.svg)](https://coveralls.io/github/andela-onnenanya/document-manager)

# Document-Manager
 **_Introduction/Background Information_**:
 
 A simple app used for creating, editing, storing and managing documents. You can access documents based on roles and user-type. It also offers API endpoints for creating and managing documents.

View the app [here](https://okdocs.herokuapp.com/)

  **_Features_**
The app has the following main features:
* User authentication with jwt
* Create, Edit and delete Documents
* Documents are categorized into <code>public</code>, <code>private</code> and <code>role</code>
* Access to document depends on user role
* Admin can access and edit all roles, users and documents
* Search users and documents
* Paginations: Documents and Users can be retrieved applying limit and offset

## API Summary

#### Note

For the full API documentation, visit [Api Documentations](https://okdocs.herokuapp.com/docs)

### Users

EndPoint | Functionality
-------- | -------------
POST /users/ | Creates a new user.
POST /users/login | Logs in a user.
POST /users/logout | Logs out a user.
GET /users/ | Find matching instances of user.
GET /users/?limit={integer}&offset={integer} | Pagination for users.
GET /search/users/?q={search word} | Search for a user.
GET /users/<id> | Find user.
PUT /users/<id> | Update user attributes.
DELETE /users/<id> | Delete user.

### Documents

EndPoint | Functionality
-------- | -------------
POST /documents/ | Creates a new document instance.
GET /documents/ | Find matching instances of document.
GET /documents/?limit={integer}&offset={integer} | Pagination for docs.
GET /documents/<id> | Find document.
PUT /documents/<id> | Update document attributes.
DELETE /documents/<id> | Delete document.
GET /users/<id>/documents | Find all documents belonging to the user.
GET /search/documents/?q={doctitle} | Search for a doc.

## Getting Started

#### Via Cloning The Repository:

```
# Clone the app
git clone 

# And then..
cd document-manager

# Create .env file in the root directory
touch .env

# Add the secrete key of your choice
SECRETE_KEY=ANY_KEY

# Create a database (this project uses postgresql, but you can use any ORM database)
# Then update the configuration file at server/config/config.json with your database credentials

# Install Node dependencies
npm install

# Run database migrations with
npm run migrate

# You can seed your database (Optional)
npm run seed:dev

# Start the app
npm start

# For test: Run test migrations to initialize test database
npm run migrate:test

# Then run test with
npm test
```

## Contributing to the project

If you are interested in participating in the development of okDocs, your ideas and contributions are welcome! It is always better to start by identifying a specific part of the app you can make better. Taking a look at the limitations is a good starting point. You can reach out to the team through the comments or [create a new issue](https://github.com/andela-onnenanya/document-manager/issues/new).

### Git Workflow

```
git checkout develop
git pull origin develop
npm install
git checkout -b branchname
Branch Naming convention: Story-Id/Story-Category/Description. eg. 093839000/Feature/Make-Api-Restful
Always review changes for styleguide and debug lines
git commit -m “message” (Commit messages)
git push origin branchname

Opening PR - (only against develop)

git pull --rebase origin develop
fix merge conflicts if any
git add . & git rebase --continue
All conflicts resolved, git push, open PR

NOTE: Pull request should be as decriptive as possible; should explain what task has been completed
```

### Style Guide & Continous Integration

```
The project uses airbnb style guide. To keep Airbnb, we have used eslint for linting the code. Looking at the .eslintrc file, Airbnb style guide is extended in linting the code.
On github, we have integrated Hounds for automated quality checks.
TravisCI is also integrated for build. Although you can raise a PR even when build fails, Merged PRs are only automatically deployed if build passes.
With this, your PRs will not be merged if the build fails. 
```

## Limitations of the project
    Currently the project has the following limitations:

    * Role Management is not available on the UI, only in the API
    * Deleted documents and users can not be restored

    The above limitations will be handled in later versions.


## Issues?
Submit your issue [here](https://github.com/andela-onnenanya/document-manager/issues)

## License

[MIT][license] Copyright (c) Nnenanya Obinna K. 2017.

<!-- Definitions -->

[license]: LICENSE
