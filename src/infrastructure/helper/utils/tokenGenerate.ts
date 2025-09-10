import jwt from 'jsonwebtoken';
import { CONFIG } from '../../orm/config/sequelize.connection';

export const generateToken = (id: number, role: string): string => {
  return jwt.sign({ id, role }, CONFIG.JWT_ACCESS_SECRET, { expiresIn: '1d' });
};
