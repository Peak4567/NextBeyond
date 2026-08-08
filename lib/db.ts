import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var _nextbeyondPool: mysql.Pool | undefined;
}

export const pool =
  global._nextbeyondPool ??
  mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "nextbeyond",
    waitForConnections: true,
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== "production") {
  global._nextbeyondPool = pool;
}
