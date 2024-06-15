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
    } else {
      res.status(404).json({
        status: 404,
        message: 'Contacts not found',
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (contact) {
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}`,
        data: contact,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: `Cant find contact with id ${contactId}`,
      });
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use('*', (err, req, res, next) => {
    res.status(500).json({
      errorMessage: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(Number(PORT), () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
