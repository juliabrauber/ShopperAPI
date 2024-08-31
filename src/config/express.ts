import express, { Application } from 'express'; 
import config from 'config';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { registerRoutes } from '../api/routes/utility-consumption-router';
import specs from './swaggerConfig';

export const createApp = (): Application => {
  const app = express();

  app.set('port', process.env.PORT || config.get<number>('server.port'));

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  registerRoutes(app);

  return app;
};
