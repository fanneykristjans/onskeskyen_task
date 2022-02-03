import express from 'express';
import { createPaymentNote, getPaymentNotes } from './payment-notes/handler';
import { getTransactionsByPaymentNoteId } from './transactions/handler';
import bodyParser from 'body-parser';

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json({ type: 'application/json' }));

app.listen(port, () => {
  console.log(`running on port ${port}.`);
});

app.post('/paymentNotes', createPaymentNote);
app.get('/paymentNotes', getPaymentNotes);
app.get('/transactions/:paymentNoteId', getTransactionsByPaymentNoteId);
