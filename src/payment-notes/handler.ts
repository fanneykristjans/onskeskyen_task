import { Request, Response } from 'express';
import { db } from '../helpers/dbconnection';
import { updateTransactionsFromPaymentNote } from '../transactions/handler';
import { v4 } from 'uuid';

export async function getPaymentNotes(req: Request, res: Response) {
  const query = 'SELECT * FROM payment_note';
  try {
    const connection = await db.getConnection();
    const result = await connection.query(query);
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
}

export async function createPaymentNote(req: Request, res: Response) {
  const { period_from_datetime, period_to_datetime } = req.body;
  const payment_note_uuid = v4();

  const query = `
    INSERT INTO payment_note (
      payment_note_uuid,
      payment_note_period_from_datetime,
      payment_note_period_to_datetime
      )
    VALUES (?, ?, ?)
    `;

  try {
    const connection = await db.getConnection();
    await connection.query(query, [
      payment_note_uuid,
      period_from_datetime,
      period_to_datetime,
    ]);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }

  await updateTransactionsFromPaymentNote(
    payment_note_uuid,
    period_from_datetime,
    period_to_datetime
  );
}

export async function updatePaymentNote(
  payment_note_uuid: string,
  transaction_sum: number,
  transaction_count: number
) {
  const query = `
  UPDATE payment_note
    SET payment_note_transactions_count = ?,
      payment_note_value = ?,
      payment_note_status_code = 'COMPLETED'
    WHERE payment_note_uuid = ?
  `;
  const connection = await db.getConnection();
  const result = await connection.query(query, [
    transaction_count,
    transaction_sum || 0,
    payment_note_uuid,
  ]);
}
