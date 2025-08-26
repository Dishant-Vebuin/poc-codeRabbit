import { Request, Response } from 'express';
import { employeePort } from '../../../application/port/employee/employeeRepo.port';
import { addEmployeeUseCase } from '../../../application/useCases/employee/addEmployee.useCase';
import { displayMessage } from '../../../infrastructure/helper/response';
import { constants } from '../../../infrastructure/config/constants';

export const addEmployeeController = (employeeRepo: employeePort) => async (req: Request, res: Response) => {
    try {
        const { name, email, position, salary, departmentId } = req.body;
        await employeeRepo.wrapTransaction(async (transaction) => {
            return await addEmployeeUseCase(
                name,
                email,
                position,
                salary,
                departmentId,
                employeeRepo,
                transaction
            )
        })
        displayMessage(
            constants.SUCCESS_STATUS.CREATED,
            constants.SUCCESS_MESSAGE.EMPLOYEE_ADDED,
            true,
            res
        )
    } catch (error) {
        if (!(error instanceof Error)) return;

        if (error.message === constants.ERROR_MESSAGE.EMPLOYEE_ALREADY_EXISTS) {
            displayMessage(
                constants.ERROR_STATUS.CONFLICT,
                error.message,
                false,
                res
            );
        }
        else {
            displayMessage(
                constants.ERROR_STATUS.INTERNAL_SERVER_ERROR,
                error.message,
                false,
                res
            )
        }
    }
}




