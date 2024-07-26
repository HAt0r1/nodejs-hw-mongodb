import fs from 'node:fs';
import swaggerUI from 'swagger-ui-express';
import createHttpError from 'http-errors';

import { SWAGGER_DIR } from '../constans/links.js';

export const swaggerDocs = () => {
  try {
    console.log('DIR', SWAGGER_DIR);
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_DIR).toString());
    console.log('SwaggerDoc', swaggerDoc);
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
