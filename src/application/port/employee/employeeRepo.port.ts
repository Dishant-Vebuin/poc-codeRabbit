import { Transaction } from "sequelize";
import { EmployeeDetails } from "../../../domain/models/employee.type";

export type employeePort = {
    addEmployee(name: string, email: string, position: string, salary: number, deptId: number, transaction: Transaction): Promise<void>;
    getEmployeeByEmail(email: string, transaction: Transaction): Promise<EmployeeDetails | null>;
    getEmployeeById(employeeId: number, transaction: Transaction): Promise<EmployeeDetails | null>;
    getAllEmployees(transaction: Transaction): Promise<EmployeeDetails[]>;
    deleteEmployeeById(employeeId: number, transaction: Transaction): Promise<void>;
    updateEmployeeById(transaction: Transaction, employeeId: number, name?: string, email?: string, position?: string, salary?: number): Promise<void>;
    wrapTransaction: <T>(fun: (transaction: Transaction) => Promise<T>) => Promise<T>;
}