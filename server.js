import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import UserRoutes from './server/routes/UserRoutes';
import RoleRoutes from './server/routes/RoleRoutes';
import DocumentRoutes from './server/routes/DocumentRoutes';
import swagger from './server/routes/swagger';

// Set up the express app
const app = express();
const router = express.Router();

// Log requests to the console.
app.use(morgan('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(path.join(__dirname, 'client/public')));


// set swagger route
swagger(router);

// set role routes
RoleRoutes.initializeRoutes(router);

// set up User routes
UserRoutes.initializeRoutes(router);

// set up Document routes
DocumentRoutes.initializeRoutes(router);

app.use('/docs', express.static(path.join(__dirname, './server/swagger/')));
app.use(router);

// Setup a default catch-all route that sends back a welcome
// message in JSON format.
// configure our catch all routes
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, './client/public/index.html'));
});

// module.exports = app;
app.listen(process.env.PORT || 8080);
console.log(`Server started on port ${process.env.PORT || 8080}`);

export default app;
