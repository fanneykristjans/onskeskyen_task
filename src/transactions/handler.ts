import { Request, Response } from 'express';
import { db } from '../helpers/dbconnection';
import { updatePaymentNote } from './../payment-notes/handler';

export async function updateTransactionsFromPaymentNote(
  payment_note_uuid: string,
  period_from_datetime: string,
  period_to_datetime: string
) {
  const updateTransactionQuery = `
    UPDATE transaction
      SET transaction_payment_note_uuid = ?,
        transaction_status_code = 'PAID'
    WHERE transaction_status_code = 'PENDING'
    AND transaction_datetime > ? AND transaction_datetime < ?
    `;

  const selectTransactionComputedValuesQuery = `
    SELECT SUM(transaction_value) AS transaction_sum, 
      COUNT(*) as transaction_count FROM transaction
    WHERE transaction_payment_note_uuid = ?
    `;

  try {
    const connection = await db.getConnection();
    await connection.query(updateTransactionQuery, [
      payment_note_uuid,
      period_from_datetime,
      period_to_datetime,
    ]);

    const result = await connection.query(
      selectTransactionComputedValuesQuery,
      [payment_note_uuid]
    );

    const transaction_sum = result[0]?.transaction_sum;
    const transaction_count = result[0]?.transaction_count;

    updatePaymentNote(payment_note_uuid, transaction_sum, transaction_count);
  } catch (err) {
    console.log(err);
  }
}

export async function getTransactionsByPaymentNoteId(
  req: Request,
  res: Response
) {
  const uuid = req.params.paymentNoteId;
  let query = `
    SELECT * FROM transaction
    WHERE transaction_payment_note_uuid = ?
    `;
  try {
    const connection = await db.getConnection();
    const result = await connection.query(query, [uuid]);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
