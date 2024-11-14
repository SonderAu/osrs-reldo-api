import mysql from 'mysql2/promise';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

let pool: any;
const dbType = process.env.DB_TYPE;

// Database Connection Pool Setup
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

// Execute Query Helper
const executeQuery = async (query: string, params: any[]): Promise<any[]> => {
  if (dbType === 'mysql') {
    const [rows] = await pool.query(query, params);
    return rows as any[];
  } else if (dbType === 'postgres') {
    const result = await pool.query(query, params);
    return result.rows;
  }
  throw new Error('Invalid database configuration');
};

// Save Character Stats
export const saveCharacterStats = async (characterName: string, userId: number, skills: any[], bosses: any[]): Promise<number> => {
  try {
    const characterQuery = dbType === 'mysql'
      ? 'INSERT INTO characters (character_name, user_id) VALUES (?, ?)'
      : 'INSERT INTO characters (character_name, user_id) VALUES ($1, $2) RETURNING id';
    const characterResult = await executeQuery(characterQuery, [characterName, userId]);
    const characterId = dbType === 'mysql' ? (characterResult as any).insertId : characterResult[0].id;

    for (const skill of skills) {
      const skillQuery = dbType === 'mysql'
        ? 'INSERT INTO skills (character_id, skill_type, level, experience) VALUES (?, ?, ?, ?)'
        : 'INSERT INTO skills (character_id, skill_type, level, experience) VALUES ($1, $2, $3, $4)';
      await executeQuery(skillQuery, [characterId, skill.type, skill.level, skill.experience]);
    }
    for (const boss of bosses) {
      const bossQuery = dbType === 'mysql'
        ? 'INSERT INTO bosses (character_id, boss_name, kill_count) VALUES (?, ?, ?)'
        : 'INSERT INTO bosses (character_id, boss_name, kill_count) VALUES ($1, $2, $3)';
      await executeQuery(bossQuery, [characterId, boss.name, boss.killCount]);
    }
    return characterId;
  } catch (error: any) {
    throw new Error(`Error saving character stats: ${String(error.message)}`);
  }
};

// Get Character Stats
export const getCharacterStats = async (characterId: number): Promise<any> => {
  try {
    const characterQuery = dbType === 'mysql' ? 'SELECT * FROM characters WHERE id = ?' : 'SELECT * FROM characters WHERE id = $1';
    const character = await executeQuery(characterQuery, [characterId]);
    if (character.length === 0) return null;

    const skillsQuery = dbType === 'mysql' ? 'SELECT * FROM skills WHERE character_id = ?' : 'SELECT * FROM skills WHERE character_id = $1';
    const skills = await executeQuery(skillsQuery, [characterId]);

    const bossesQuery = dbType === 'mysql' ? 'SELECT * FROM bosses WHERE character_id = ?' : 'SELECT * FROM bosses WHERE character_id = $1';
    const bosses = await executeQuery(bossesQuery, [characterId]);

    return { ...character[0], skills, bosses };
  } catch (error: any) {
    throw new Error(`Error retrieving character stats: ${String(error.message)}`);
  }
};

// Update Character Stats
export const updateCharacterStats = async (characterId: number, skills: any[], bosses: any[]): Promise<void> => {
  try {
    for (const skill of skills) {
      const skillQuery = dbType === 'mysql'
        ? 'UPDATE skills SET level = ?, experience = ? WHERE character_id = ? AND skill_type = ?'
        : 'UPDATE skills SET level = $1, experience = $2 WHERE character_id = $3 AND skill_type = $4';
      await executeQuery(skillQuery, [skill.level, skill.experience, characterId, skill.type]);
    }

    for (const boss of bosses) {
      const bossQuery = dbType === 'mysql'
        ? 'UPDATE bosses SET kill_count = ? WHERE character_id = ? AND boss_name = ?'
        : 'UPDATE bosses SET kill_count = $1 WHERE character_id = $2 AND boss_name = $3';
      await executeQuery(bossQuery, [boss.killCount, characterId, boss.name]);
    }
  } catch (error: any) {
    throw new Error(`Error updating character stats: ${String(error.message)}`);
  }
};

// Get All Character Stats
export const getAllCharacterStats = async (userId: number | null): Promise<any[]> => {
  try {
    const query = userId !== null
      ? dbType === 'mysql'
        ? 'SELECT * FROM characters WHERE user_id = ?'
        : 'SELECT * FROM characters WHERE user_id = $1'
      : 'SELECT * FROM characters';
    const params = userId !== null ? [userId] : [];
    return await executeQuery(query, params);
  } catch (error: any) {
    throw new Error(`Error retrieving all character stats: ${String(error.message)}`);
  }
};
