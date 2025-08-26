import Joi from "joi";

export const addProjectsSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        "string.base": `"name" should be a type of 'text'`,
        "string.empty": `"name" cannot be an empty field`,
        "string.min": `"name" should have a minimum length of 2`,
    }),
    description: Joi.string().min(10).max(500).required().messages({
        "string.base": `"description" should be a type of 'text'`,
        "string.empty": `"description" cannot be an empty field`,
        "string.min": `"description" should have a minimum length of 10`,
    }),
    status: Joi.string().valid("active", "archived", "inactive").default("active").messages({
        "any.only": `"status" must be one of {#valids}"`
    }),
});

