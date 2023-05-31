import express, { Request, Response } from 'express';
import User from '../model/User';
const router = express.Router();

router.post('/user', function (req: Request, res: Response) {
  console.log(req.params);
  const user = User.build({ email: req.params.email });
  console.log(user instanceof User);
  console.log(user.toJSON());
});

export default router;
