import Joi from "joi";

export const addTasksLogSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": `"id" should be a type of 'number'`,
            "number.integer": `"id" must be an integer`,
            "number.positive": `"id" must be a positive number`,
            "any.required": `"id" is a required field`
        }),

    status: Joi.string()
        .valid("completed", "archived")
        .required()
        .messages({
            "any.only": `"status" must be either 'completed' or 'archived'`
        }),

    loggedBy: Joi.string()
        .messages({
            "string.base": `"loggedBy" must be a string`
        })
})
.unknown(false);
