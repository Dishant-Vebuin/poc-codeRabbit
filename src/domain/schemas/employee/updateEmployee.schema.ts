import Joi from "joi";

export const updateEmployeeWithIdSchema = Joi.object({
  employeeId: Joi.string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      "string.pattern.base": "employeeId must be a valid integer",
      "any.required": "employeeId is required in params",
    }),

  // Body
  name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  position: Joi.string().min(3).max(50).optional(),
  salary: Joi.number().min(0).optional(),
})
.or("name", "email", "position", "salary") // at least one updatable field required
.messages({
  "object.missing": "At least one field (name, email, position, salary) must be provided",
});
