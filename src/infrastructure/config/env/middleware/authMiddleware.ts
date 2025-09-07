import { NextFunction, Request, Response } from 'express';
import { displayMessage } from '../response';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { constants } from '../../constants';
import { CONFIG } from '../../../orm/config/sequelize.connection';

export const authMiddleware =
  (compulsion?: boolean) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1]?.trim();
    if (!token) {
      if (compulsion ?? true) {
        displayMessage(
          constants.ERROR_STATUS.AUTHENTICATION_FAILED,
          constants.ERROR_MESSAGE.TOKEN_MISSING,
          false,
          res
        );
        return;
      } else {
        return next();
      }
    }

    try {
      const secret =  CONFIG.JWT_ACCESS_SECRET;
      const decoded = jwt.verify(token as string, secret) as JwtPayload;
      if (decoded) {
        res.locals.user = decoded;
        return next();
      }

      throw new Error(constants.ERROR_MESSAGE.UNAUTHORIZED_ACCESS);
    } catch (err) {
      switch (true) {
        case err instanceof jwt.TokenExpiredError:
          displayMessage(
            constants.ERROR_STATUS.AUTHENTICATION_FAILED,
            constants.ERROR_MESSAGE.TOKEN_EXPIRED,
            false,
            res
          );
          break;
        case err instanceof jwt.JsonWebTokenError:
          displayMessage(
            constants.ERROR_STATUS.AUTHENTICATION_FAILED,
            constants.ERROR_MESSAGE.TOKEN_ERROR,
            false,
            res
          );
          break;
        case err instanceof Error:
          displayMessage(
            constants.ERROR_STATUS.AUTHENTICATION_FAILED,
            constants.ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
            false,
            res
          );
          break;
        default:
          displayMessage(
            constants.ERROR_STATUS.INTERNAL_SERVER_ERROR,
            constants.ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            false,
            res
          );
      }
    }
  };
