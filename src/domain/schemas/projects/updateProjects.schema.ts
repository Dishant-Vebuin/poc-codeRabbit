import Joi from "joi";

export const updateProjectsSchema = Joi.object({
    projectId: Joi.number().integer().min(1).required().messages({
        "number.base": `"projectId" should be a type of 'number'`,
        "number.empty": `"projectId" cannot be an empty field`,
        "number.min": `"projectId" should be greater than or equal to 1`
    }),
    name: Joi.string().min(2).max(100).required().messages({
        "string.base": `"name" should be a type of 'text'`,
        "string.empty": `"name" cannot be an empty field`,
        "string.min": `"name" should have a minimum length of 2`,
    }),
    description: Joi.string().min(10).max(500).optional().messages({
        "string.base": `"description" should be a type of 'text'`,
        "string.empty": `"description" cannot be an empty field`,
        "string.min": `"description" should have a minimum length of 10`,
    }),
})