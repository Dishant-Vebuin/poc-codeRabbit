import { Request, Response } from 'express';
import { employeePort } from "../../../application/port/employee/employeeRepo.port";
import { constants } from "../../../infrastructure/config/constants";
import { displayMessage } from "../../../infrastructure/helper/response";
import { deleteEmployeeDetailsUseCase } from '../../../application/useCases/employee/deleteEmployee.useCase';

export const deleteEmployeeDetailsController = (employeeRepo: employeePort) => async (req: Request, res: Response) => {
    try {
        const empId = Number(req.params.employeeId);
        await employeeRepo.wrapTransaction(async (transaction) => {
            return await deleteEmployeeDetailsUseCase(
                empId,
                employeeRepo,
                transaction
            )
        })
        displayMessage(
            constants.SUCCESS_STATUS.OK,
            constants.SUCCESS_MESSAGE.EMPLOYEE_DELETED,
            true,
            res
        )
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