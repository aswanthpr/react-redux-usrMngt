// JWT middleware example
import jwt,{Secret} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: { id: string };
}

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as { id: string };
    req.user = { id: decoded.id }; // Attach user ID to req.user
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
