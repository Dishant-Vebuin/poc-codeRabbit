import { Request, Response } from "express";
import { userPort } from "../../../application/port/user/userRepo.port";
import { displayMessage } from "../../../infrastructure/helper/response";
import { constants } from "../../../infrastructure/config/constants";
import { loginUserUseCase } from "../../../application/useCases/user/loginUser.useCase";

export const loginUserController = (userRepo: userPort) => async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await userRepo.wrapTransaction(async (transaction) => {
            return await loginUserUseCase(email, password, userRepo, transaction)
        })

        displayMessage(
            constants.SUCCESS_STATUS.OK,
            constants.SUCCESS_MESSAGE.USER_LOGIN,
            true,
            res,
            token
        )
    } catch (error) {
        if (!(error instanceof Error)) return;
        if (error.message === constants.ERROR_MESSAGE.USER_NOT_FOUND) {
            displayMessage(
                constants.ERROR_STATUS.NOT_FOUND,
                error.message,
                false,
                res
            )
        }
        else if (error.message === constants.ERROR_MESSAGE.INVALID_CREDENTIALS) {
            displayMessage(
                constants.ERROR_STATUS.AUTHENTICATION_FAILED,
                error.message,
                false,
                res
            )
        }
        else {
            displayMessage(
                constants.ERROR_STATUS.INTERNAL_SERVER_ERROR,
                constants.ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
                false,
                res
            )
        }
    }
}