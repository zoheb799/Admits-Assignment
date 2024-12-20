import jwt from 'jsonwebtoken'
import { User } from '../models/user.js';

export const authMiddleware = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
  
      if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
  
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized access" });
      }
  
      next();
    } catch (error) {
      res.status(500).json({ message: "Token verification failed", error });
    }
  };