import cluster from 'cluster';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import UserRoutes from './server/routes/UserRoutes';
import RoleRoutes from './server/routes/RoleRoutes';
import DocumentRoutes from './server/routes/DocumentRoutes';
import swagger from './server/routes/swagger';

if (cluster.isMaster) {
    // Listen for dying workers
  cluster.on('exit', (worker) => {
    // Replace the dead worker,
    // we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();
  });
}

const app = express();
const router = express.Router();

// Log requests to the console.
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(path.join(__dirname, 'client/public')));

swagger(router);

RoleRoutes.initializeRoutes(router);

UserRoutes.initializeRoutes(router);

DocumentRoutes.initializeRoutes(router);

app.use('/docs', express.static(path.join(__dirname, './server/swagger/')));
app.use(router);

// Setup a default catch-all route that sends back a welcome
// message in JSON format.
// configure our catch all routes
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, './client/public/index.html'));
});

app.listen(process.env.PORT || 8080);
console.log(`Server started on port ${process.env.PORT || 8080}`);
export default app;
