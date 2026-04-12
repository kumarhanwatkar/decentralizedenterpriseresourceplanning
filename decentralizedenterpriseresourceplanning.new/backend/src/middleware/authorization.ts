import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';

// Usage: authorize('admin')
export default function authorize(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Assume req.user is set by authentication middleware
    const user = (req as any).user;
    if (!user || user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
    }
    next();
    return;
  };
}
