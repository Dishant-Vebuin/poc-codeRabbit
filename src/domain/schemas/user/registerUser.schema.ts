import Joi from "joi";

export const registerUserSchema = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Username cannot be empty',
        'string.min': 'Username should have a minimum length of 3 characters',
        'string.max': 'Username should have a maximum length of 50 characters',
    }),
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
    role: Joi.string().valid("admin", "user").default("user")
}).unknown(false).prefs({ abortEarly: false });