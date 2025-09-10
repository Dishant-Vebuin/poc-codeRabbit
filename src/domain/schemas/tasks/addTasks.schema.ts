import Joi from "joi";

export const addTasksSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
        "string.base": `"title" should be a type of 'text'`,
        "string.empty": `"title" cannot be an empty field`,
        "string.min": `"title" should have a minimum length of {#limit}`,
        "string.max": `"title" should have a maximum length of {#limit}`,
        "any.required": `"title" is a required field`
    }),
    description: Joi.string().min(5).max(500).required().messages({
        "string.base": `"description" should be a type of 'text'`,
        "string.empty": `"description" cannot be an empty field`,
        "string.min": `"description" should have a minimum length of {#limit}`,
        "string.max": `"description" should have a maximum length of {#limit}`,
        "any.required": `"description" is a required field`
    }),
    status: Joi.string().valid("pending", "in-progress", "completed", "archived").default("pending").messages({
        "string.base": `"status" should be a type of 'text'`,
        "any.only": `"status" must be one of {#valids}`,
        "any.required": `"status" is a required field`
    }),
    deadline: Joi.date().greater('now').messages({
        "date.base": `"deadline" should be a type of 'date'`,
        "date.greater": `"deadline" must be a date in the future`,
        "any.required": `"deadline" is a required field`
    }),
    assigneeId: Joi.number().min(3).max(100).optional().allow(null).messages({
        "number.base": `"assigneeId" should be a type of 'number'`,
        "number.empty": `"assigneeId" cannot be an empty field`,
        "number.min": `"assigneeId" should have a minimum length of 3`,
        "number.max": `"assigneeId" should have a maximum length of 100`
    }),
    projectId: Joi.number().integer().positive().required().messages({
        "number.base": `"projectId" should be a type of 'number'`,
        "number.integer": `"projectId" must be an integer`,
        "number.positive": `"projectId" must be a positive number`,
        "any.required": `"projectId" is a required field`
    })
})