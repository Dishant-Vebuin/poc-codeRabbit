import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const validateSchema =
    (schema: Joi.Schema) =>
        (req: Request, res: Response, next: NextFunction): void => {
            const toValidate = {
                ...req.body,
                ...req.params,
                ...req.query,
            };

            const { error } = schema.validate(toValidate);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            next();
        };
