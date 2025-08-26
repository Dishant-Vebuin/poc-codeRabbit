import Joi from "joi";

export const taskIdSchema = Joi.object({
    taskId: Joi.number().integer().positive().required().messages({
        "number.base": `"taskId" should be a type of 'number'`,
        "number.integer": `"taskId" must be an integer`,
        "number.positive": `"taskId" must be a positive number`,
        "any.required": `"taskId" is a required field`
    })
})