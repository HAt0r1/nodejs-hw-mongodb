import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

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

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    if (contacts) {
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({
        status: 404,
        message: `Cant find contact with id ${contactId}`,
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(Number(PORT), () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
