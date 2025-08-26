import Joi from "joi";

export const employeeIdSchema = Joi.object({
  employeeId: Joi.string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      "string.pattern.base": "employeeId must be a valid integer",
    })
}).required();
