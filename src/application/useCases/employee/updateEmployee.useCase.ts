import { employeePort } from "../../port/employee/employeeRepo.port";
import { constants } from "../../../infrastructure/config/constants";

export const updateEmployeeUseCase = async (
  employeeId: number,
  updates: { name?: string; email?: string; position?: string; salary?: number },
  employeeRepo: employeePort,
  transaction: any
) => {
  const employee = await employeeRepo.getEmployeeById(employeeId, transaction);

  if (!employee) {
    throw new Error(constants.ERROR_MESSAGE.EMPLOYEE_NOT_FOUND);
  }

  return await employeeRepo.updateEmployeeById(transaction, employeeId, updates.name, updates.email, updates.position, updates.salary);
};
