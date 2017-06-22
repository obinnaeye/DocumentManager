# Document-Manager
A simple app used for creating, editing, storing and managing documents. You can access documents based on roles and user-type. It also offers API endpoints for creating and managing documents.

View the app [here](https://okdocs.herokuapp.com/)

## API Summary

#### Note

For the full API documentation, visit [Api Documentations](https://okdocs.herokuapp.com/docs)

## Users

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

## Documents

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

## Issues?
Submit your issue [here]

## License

MIT License (MIT).
