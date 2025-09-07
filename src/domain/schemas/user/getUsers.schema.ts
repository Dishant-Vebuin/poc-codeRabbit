import Joi from "joi";

export const getUsersSchema = Joi.object({
    id: Joi.number().integer().min(1).required().messages({
        'number.base': 'User ID must be a number',
        'number.integer': 'User ID must be an integer',
        'number.min': 'User ID must be a positive integer',
        'any.required': 'User ID is required',
    }),
});