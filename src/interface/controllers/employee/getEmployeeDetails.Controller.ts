import { Request, Response } from 'express';
import { employeePort } from '../../../application/port/employee/employeeRepo.port';
import { addEmployeeUseCase } from '../../../application/useCases/employee/addEmployee.useCase';
import { displayMessage } from '../../../infrastructure/helper/response';
import { constants } from '../../../infrastructure/config/constants';
import { getEmployeeDetailsUseCase } from '../../../application/useCases/employee/getEmployeeDetails.useCase';

export const getEmployeeController = (employeeRepo: employeePort) => async (req: Request, res: Response) => {
    try {
        const result = await employeeRepo.wrapTransaction(async (transaction) => {
            return await getEmployeeDetailsUseCase(
                employeeRepo,
                transaction
            )
        })
        displayMessage(
            constants.SUCCESS_STATUS.OK,
            constants.SUCCESS_MESSAGE.EMPLOYEE_FETCHED,
            true,
            res,
            result)
    } catch (error) {
        if (!(error instanceof Error)) return;

        if (error.message === constants.ERROR_MESSAGE.EMPLOYEE_NOT_FOUND) {
            displayMessage(
                constants.ERROR_STATUS.NOT_FOUND,
                error.message,
                false,
                res
            );
        } else {
            displayMessage(
                constants.ERROR_STATUS.INTERNAL_SERVER_ERROR,
                error.message,
                false,
                res
            )
        }
    }
}