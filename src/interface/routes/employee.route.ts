import express from 'express';
import { validateSchema } from '../../infrastructure/helper/middleware/validateSchema';
import { addEmployeeSchema } from '../../domain/schemas/employee/addEmployee.schema';
import { addEmployeeController } from '../controllers/employee/addEmployee.Controller';
import { employeeRepository } from '../../infrastructure/repositories/employee.repository';
import { getEmployeeController } from '../controllers/employee/getEmployeeDetails.Controller';
import { employeeIdSchema } from '../../domain/schemas/employee/employeeId.schema';
import { deleteEmployeeDetailsController } from '../controllers/employee/deleteEmployeeDetails.Controller';
import { updateEmployeeWithIdSchema } from '../../domain/schemas/employee/updateEmployee.schema';
import { updateEmployeeDetailsController } from '../controllers/employee/updateEmployeeDetails.Controller';
const employeeRouter = express.Router();

employeeRouter.post('/add-employee', validateSchema(addEmployeeSchema), addEmployeeController(employeeRepository))
employeeRouter.get('/get-employee', getEmployeeController(employeeRepository));
employeeRouter.delete('/delete-employee/:employeeId', validateSchema(employeeIdSchema), deleteEmployeeDetailsController(employeeRepository));
employeeRouter.patch('/update-employee/:employeeId', validateSchema(updateEmployeeWithIdSchema), updateEmployeeDetailsController(employeeRepository))

export { employeeRouter };