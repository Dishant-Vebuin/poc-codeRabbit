import { Transaction } from "sequelize";
import { EmployeeDetails } from "../../../domain/models/employee.type";
import { constants } from "../../../infrastructure/config/constants";
import { employeePort } from "../../port/employee/employeeRepo.port";

export const deleteEmployeeDetailsUseCase = async (empId: number, employeeRepo: employeePort, transaction: Transaction): Promise<void> => {
    const employeeDetails = await employeeRepo.getEmployeeById(empId, transaction);
    if (!employeeDetails) {
        throw new Error(constants.ERROR_MESSAGE.EMPLOYEE_NOT_FOUND);
    }
    await employeeRepo.deleteEmployeeById(empId, transaction);
}