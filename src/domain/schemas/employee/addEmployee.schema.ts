import Joi from 'joi';

export const addEmployeeSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    position: Joi.string().min(3).max(50).required(),
    salary: Joi.number().min(0).required(),
    departmentId: Joi.number().integer().min(1).required()
});
