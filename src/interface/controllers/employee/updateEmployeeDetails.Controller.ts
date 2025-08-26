import { Request, Response } from "express";
import { employeePort } from "../../../application/port/employee/employeeRepo.port";
import { displayMessage } from "../../../infrastructure/helper/response";
import { constants } from "../../../infrastructure/config/constants";
import { updateEmployeeUseCase } from "../../../application/useCases/employee/updateEmployee.useCase";

export const updateEmployeeDetailsController =
  (employeeRepo: employeePort) => async (req: Request, res: Response) => {
    try {
      const employeeId = Number(req.params.employeeId);
      const { name, email, position, salary } = req.body;

      await employeeRepo.wrapTransaction(async (transaction) => {
        return await updateEmployeeUseCase(
          employeeId,
          { name, email, position, salary },
          employeeRepo,
          transaction
        );
      });

      displayMessage(
        constants.SUCCESS_STATUS.OK,
        constants.SUCCESS_MESSAGE.EMPLOYEE_UPDATED,
        true,
        res
      );
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
        );
      }
    }
  };
