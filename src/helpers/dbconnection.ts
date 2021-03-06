import mysql from 'mysql2';

class Database {
  private mysql: mysql.Pool;

  constructor(config: mysql.PoolOptions) {
    this.mysql = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
    });
  }

  getConnection() {
    return new Promise<Connection>((resolve, reject) => {
      this.mysql.getConnection((err, conn) => {
        if (err) return reject(err);
        resolve(new Connection(conn));
      });
    });
  }
}

class Connection {
  private connection: mysql.PoolConnection;

  constructor(connection: mysql.PoolConnection) {
    this.connection = connection;
  }

  async query(query: string, params?: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, params, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}

export const db = new Database({
  host: 'localhost',
  user: 'testuser',
  password: 'testsecret',
  database: 'onskeskyendb',
});
