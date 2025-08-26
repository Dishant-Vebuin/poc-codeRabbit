import Joi from "joi";

export const LoginUserSchema = Joi.object({
    email: Joi.string().email().min(5).max(120).required().messages({
        'string.empty': 'Email cannot be empty',
        'string.email': 'Email must be a valid email address',
        'string.min': 'Email should have a minimum length of 5 characters',
        'string.max': 'Email should have a maximum length of 120 characters',
    }),
    password: Joi.string().min(6).max(255).required().messages({
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password should have a minimum length of 6 characters',
        'string.max': 'Password should have a maximum length of 255 characters',
    }),
})