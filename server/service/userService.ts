import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import { Client } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });
console.log('Environment Variables Loaded:', process.env.DB_TYPE, process.env.POSTGRES_HOST);

let pool: any;
const dbType = process.env.DB_TYPE;

if (dbType === 'mysql') {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
} else if (dbType === 'postgres') {
  pool = new Client({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  });
  pool.connect();
} else {
  throw new Error('Unsupported DB_TYPE specified in .env file');
}

// Utility function to execute queries based on DB type
export const executeQuery = async (query: string, params: any[]): Promise<any> => {
  if (dbType === 'mysql') {
    const [rows] = await pool.query(query, params);
    return rows;
  } else if (dbType === 'postgres') {
    const result = await pool.query(query, params);
    return result.rows;
  }
};

// Register user function
export const registerUser = async (username: string, password: string): Promise<void> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const query = dbType === 'mysql'
    ? 'INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)'
    : 'INSERT INTO users (username, password_hash, salt) VALUES ($1, $2, $3)';
  await executeQuery(query, [username, hashedPassword, salt]);
};

// Login handler function
export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const query = dbType === 'mysql'
      ? 'SELECT * FROM users WHERE username = ?'
      : 'SELECT * FROM users WHERE username = $1';
    const rows = await executeQuery(query, [username]);

    if (!rows || rows.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (isMatch) {
      const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET as string, {
        expiresIn: '24h',
      });
      res.status(200).json({ success: true, token, username: user.username });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in loginHandler:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};
