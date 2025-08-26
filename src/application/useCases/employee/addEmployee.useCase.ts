import { Transaction } from "sequelize";
import { employeePort } from "../../port/employee/employeeRepo.port";
import { constants } from "../../../infrastructure/config/constants";

export const addEmployeeUseCase = async (
    name: string,
    email: string,
    position: string,
    salary: number,
    departmentId: number,
    employeeRepo: employeePort,
    transaction: Transaction
): Promise<void> => {
    const employeeDetails = await employeeRepo.getEmployeeByEmail(email, transaction)
    if (employeeDetails) {
        throw new Error(constants.ERROR_MESSAGE.EMPLOYEE_ALREADY_EXISTS);
    }
    await employeeRepo.addEmployee(name, email, position, salary, departmentId, transaction);
}