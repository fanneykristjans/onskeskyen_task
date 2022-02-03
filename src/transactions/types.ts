export interface UpdateTransactionsResponseItem {
  transaction_sum: number;
  transaction_count: number;
}

export type UpdateTransactionsResponse = [UpdateTransactionsResponseItem?];

export interface Transaction {
  transaction_uuid: string;
  transaction_status_code: string;
  transaction_value: number;
  transaction_datetime: string;
  transaction_payment_note_uuid: string;
}

export type GetTransactionsResponse = Transaction[];
