import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { env } from './utils/env.js';

const PORT = env('PORT');

const setupServer = () => {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(Number(PORT), () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
