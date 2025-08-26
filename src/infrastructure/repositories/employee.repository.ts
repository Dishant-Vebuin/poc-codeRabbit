import fs from 'fs';
import path from "path";
import { QueryTypes, Transaction } from 'sequelize';
import { employeePort } from "../../application/port/employee/employeeRepo.port";
import { sequelize } from "../config/dbConnection";
import { wrapTransaction } from '../helper/middleware/transaction';
import { EmployeeDetails } from '../../domain/models/employee.type';

export const employeeRepository: employeePort = {
    wrapTransaction,
    addEmployee: async (name: string, email: string, position: string, salary: number, departmentId: number, transaction: Transaction) => {
        const addEmployeeQuery = fs.readFileSync(
            path.join(__dirname, "sql/addEmployee.sql"),
            "utf-8"
        );

        await sequelize.query(addEmployeeQuery, {
            replacements: { name, email, position, salary, departmentId },
            type: QueryTypes.INSERT,
            transaction
        });
    },
    getEmployeeByEmail: async (email: string, transaction: Transaction) => {
        const getEmployeeByEmailQuery = fs.readFileSync(
            path.join(__dirname, "sql/getEmployeeByEmail.sql"),
            "utf-8"
        );
        const result = await sequelize.query<EmployeeDetails>(getEmployeeByEmailQuery, {
            replacements: { email },
            type: QueryTypes.SELECT,
            transaction
        });

        return result ? result[0] : null;
    },
    getEmployeeById: async (employeeId: number, transaction: Transaction) => {
        const getEmployeeByIdQuery = fs.readFileSync(
            path.join(__dirname, "sql/getEmployeeById.sql"),
            "utf-8"
        );
        const result = await sequelize.query<EmployeeDetails>(getEmployeeByIdQuery, {
            replacements: { employeeId },
            type: QueryTypes.SELECT,
            transaction
        });

        return result ? result[0] : null;
    },
    getAllEmployees: async (transaction: Transaction) => {
        const getAllEmployeesQuery = fs.readFileSync(
            path.join(__dirname, "sql/getAllEmployees.sql"),
            "utf-8"
        );
        const result = await sequelize.query<EmployeeDetails>(getAllEmployeesQuery, {
            type: QueryTypes.SELECT,
            transaction
        });
        return result;
    },
    deleteEmployeeById: async (employeeId: number, transaction: Transaction) => {
        const deleteEmployeeByIdQuery = fs.readFileSync(
            path.join(__dirname, "sql/deleteEmployeeById.sql"),
            "utf-8"
        );

        await sequelize.query(deleteEmployeeByIdQuery, {
            replacements: { employeeId },
            type: QueryTypes.DELETE,
            transaction
        });
    },
    updateEmployeeById: async (transaction: Transaction, employeeId: number, name?: string, email?: string, position?: string, salary?: number) => {
        const updateEmployeeByIdQuery = fs.readFileSync(
            path.join(__dirname, "sql/updateEmployeeById.sql"),
            "utf-8"
        );

        await sequelize.query(updateEmployeeByIdQuery, {
            replacements: { employeeId, name: name ?? null, email: email ?? null, position: position ?? null, salary: salary ?? null },
            type: QueryTypes.UPDATE,
            transaction
        });
    }
}