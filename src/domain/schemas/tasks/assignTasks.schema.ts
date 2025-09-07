import Joi from "joi";

export const assignTasksSchema = Joi.object({
    taskId: Joi.number().integer().positive().required().messages({
        "number.base": `"taskId" should be a type of 'number'`,
        "number.integer": `"taskId" should be an integer`,
        "number.positive": `"taskId" should be a positive number`,
        "any.required": `"taskId" is a required field`
    }),
    assigneeId: Joi.number().integer().positive().required().messages({
        "number.base": `"assigneeId" should be a type of 'number'`,
        "number.integer": `"assigneeId" should be an integer`,
        "number.positive": `"assigneeId" should be a positive number`,
        "any.required": `"assigneeId" is a required field`
    }),
    status: Joi.string().valid("pending", "in-progress", "completed", "archived").required().messages({
        "string.base": `"status" should be a type of 'string'`,
        "any.only": `"status" must be one of the following values: 'pending', 'in-progress', 'completed', 'archived'`,
        "any.required": `"status" is a required field`
    })
})