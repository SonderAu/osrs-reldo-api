import { Router, Request, Response, NextFunction } from 'express';
import { saveCharacterStats, getCharacterStats, updateCharacterStats, getAllCharacterStats } from '../service/characterStatsService';

const router = Router();

// Define the type for asynchronous route handler functions to always return a Response
type AsyncHandlerFunction = (req: Request, res: Response, next: NextFunction) => Promise<Response>;

// Helper to handle async errors
const asyncHandler = (fn: AsyncHandlerFunction) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Save new character stats
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { characterName, userId, skills, bosses } = req.body;
    const characterId = await saveCharacterStats(characterName, userId, skills, bosses);
    return res.status(201).json({ success: true, characterId });
  }),
);

// Get character stats by ID
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const characterId = parseInt(req.params.id);
    const characterData = await getCharacterStats(characterId);
    if (!characterData) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }
    return res.json({ success: true, characterData });
  }),
);

// Update character stats by ID
router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const characterId = parseInt(req.params.id);
    const { skills, bosses } = req.body;
    await updateCharacterStats(characterId, skills, bosses);
    return res.json({ success: true });
  }),
);

// Get all characters or filter by user
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
    const characters = await getAllCharacterStats(userId);
    return res.json({ success: true, characters });
  }),
);
