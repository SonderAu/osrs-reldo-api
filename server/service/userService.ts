import { Request, Response } from 'express';
import mysql, { RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const registerUser = async (username: string, password: string): Promise<void> => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query(
      'INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)',
      [username, hashedPassword, salt],
    );
  };

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (isMatch) {
      const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET as string, {
        expiresIn: '24h',
      });

      res.status(200).json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in loginHandler:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};
