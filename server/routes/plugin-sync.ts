import express, { NextFunction, Request, Response } from 'express';
import { executeQuery } from '../service/userService';

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

const pluginSyncRouter = express.Router();

type TaskData = {
  completedOn?: number; // Optional fields
  ignoredOn?: number;
  trackedOn?: number;
};

// Function to handle batch inserts
const insertOrUpdate = async (
  query: string,
  data: Record<string, any>,
  userId: number,
): Promise<void> => {
  for (const [key, value] of Object.entries(data)) {
    await executeQuery(query, [userId, key, value]);
  }
};

// Function to insert or update tasks
const insertOrUpdateTasks = async (
  tasks: Record<string, TaskData>,
  userId: number,
): Promise<void> => {
  const query = `
    INSERT INTO tb_plug_tasks (user_id, task_id, completed_on, ignored_on, tracked_on)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_id, task_id) DO UPDATE
    SET completed_on = $3, ignored_on = $4, tracked_on = $5
  `;

  for (const [taskId, taskData] of Object.entries(tasks)) {
    const { completedOn = 0, ignoredOn = 0, trackedOn = 0 } = taskData;
    await executeQuery(query, [userId, taskId, completedOn, ignoredOn, trackedOn]);
  }
};

pluginSyncRouter.post(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      try {
        const { username, token, data } = req.body;

        // Validate token and username
        if (!username || !token || !data) {
          res.status(400).json({ error: 'Missing required fields in request body' });
          return;
        }

        let parsedData;
        try {
          // Parse the JSON string in the data field
          parsedData = JSON.parse(data.data);
        } catch (err) {
          console.error('Failed to parse data JSON:', err.message);
          res.status(400).json({ error: 'Invalid JSON format in data field' });
          return;
        }

        // Extract fields from the parsed data
        const {
          quests,
          diaries,
          runescapeVersion,
          runeliteVersion,
          timestamp,
          taskType,
          varbits,
          varps,
          tasks,
        } = parsedData;

        const displayName = parsedData.displayName; // If displayName exists in parsedData

        // Validate required fields
        if (!displayName || !runescapeVersion || !runeliteVersion || !taskType) {
          res.status(400).json({ error: 'Missing required fields in data payload' });
          return;
        }

        // Fetch user ID for the given displayName
        const userResult = await executeQuery(
          'SELECT id FROM users WHERE username = $1',
          [username],
        );
        if (userResult.length === 0) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        const userId = userResult[0].id;

        // Insert sync metadata into the database
        await executeQuery(
          `INSERT INTO tb_plug_sync_metadata (user_id, timestamp, runescape_version, runelite_version, task_type)
           VALUES ($1, $2, $3, $4, $5)`,
          [userId, timestamp, runescapeVersion, runeliteVersion, taskType],
        );

      // Insert or update quests
      await insertOrUpdate(
        `
          INSERT INTO tb_plug_quests (user_id, quest_id, status)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, quest_id) DO UPDATE SET status = $3
        `,
        quests,
        userId,
      );

      // Insert or update diaries
      await insertOrUpdate(
        `
          INSERT INTO tb_plug_diaries (user_id, diary_id, progress)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, diary_id) DO UPDATE SET progress = $3
        `,
        diaries,
        userId,
      );

      // Insert or update varbits
      await insertOrUpdate(
        `
          INSERT INTO tb_plug_varbits (user_id, varbit_id, value)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, varbit_id) DO UPDATE SET value = $3
        `,
        varbits,
        userId,
      );

      // Insert or update varps
      await insertOrUpdate(
        `
          INSERT INTO tb_plug_varps (user_id, varp_id, value)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, varp_id) DO UPDATE SET value = $3
        `,
        varps,
        userId,
      );

      // Insert or update tasks
      await insertOrUpdateTasks(tasks, userId);

      res.status(200).json({ message: 'Plugin data synced successfully' });
    } catch (error) {
      console.error('Error syncing plugin data:', error.message);
      res.status(500).json({ error: 'Failed to sync plugin data' });
    }
  }),
);

export default pluginSyncRouter;
