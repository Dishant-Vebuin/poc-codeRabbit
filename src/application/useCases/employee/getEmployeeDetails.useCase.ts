import { Transaction } from "sequelize";
import { EmployeeDetails } from "../../../domain/models/employee.type";
import { constants } from "../../../infrastructure/config/constants";
import { employeePort } from "../../port/employee/employeeRepo.port";

export const getEmployeeDetailsUseCase = async (employeeRepo: employeePort, transaction: Transaction): Promise<EmployeeDetails[]> => {
    const employeeDetails = await employeeRepo.getAllEmployees(transaction);
    if (!employeeDetails) {
        throw new Error(constants.ERROR_MESSAGE.EMPLOYEE_NOT_FOUND);
    }
    return employeeDetails;
}