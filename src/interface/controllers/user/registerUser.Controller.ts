import { Request, Response } from "express";
import { userPort } from "../../../application/port/user/userRepo.port"
import { registerUserUseCase } from "../../../application/useCases/user/registerUser.useCase";
import { constants } from "../../../infrastructure/config/constants"
import { displayMessage } from "../../../infrastructure/helper/response"

export const registerUserController = (userRepo: userPort) => async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;
        const token = await userRepo.wrapTransaction(async (transaction) => {
            return await registerUserUseCase(username, email, password, role, userRepo, transaction);
        })
        displayMessage(
            constants.SUCCESS_STATUS.CREATED,
            constants.SUCCESS_MESSAGE.USER_ADDED,
            true,
            res,
            token
        )
    } catch (error) {
        if (!(error instanceof Error)) {
            displayMessage(
                constants.ERROR_STATUS.INTERNAL_SERVER_ERROR,
                constants.ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
                false,
                res
            );
            return;
        }
        if (error.message === constants.ERROR_MESSAGE.USER_ALREADY_EXISTS) {
            displayMessage(
                constants.ERROR_STATUS.CONFLICT,
                constants.ERROR_MESSAGE.USER_ALREADY_EXISTS,
                false,
                res
            );
        } else {
            displayMessage(
                constants.ERROR_STATUS.INTERNAL_SERVER_ERROR,
                constants.ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
                false,
                res
            );
        }
    }
}