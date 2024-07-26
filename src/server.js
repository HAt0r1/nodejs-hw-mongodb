import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = env('PORT');

const setupServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );

  app.use(cors());

  app.use('/api-docs', swaggerDocs());

  app.use(cookieParser());

  app.use(
    pino({
      transport: { target: 'pino-pretty' },
    }),
  );

  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(Number(PORT), () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
