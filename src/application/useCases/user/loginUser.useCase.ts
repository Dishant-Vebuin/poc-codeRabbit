import { Transaction } from "sequelize";
import { userPort } from "../../port/user/userRepo.port";
import { constants } from "../../../infrastructure/config/constants";
import bcrypt from "bcrypt";
import { generateToken } from "../../../infrastructure/helper/utils/tokenGenerate";

export const loginUserUseCase = async (email: string, password: string, userRepo: userPort, transaction: Transaction): Promise<string> => {
    const userExists = await userRepo.getUserByEmail(email, transaction);
    if (!userExists) {
        throw new Error(constants.ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (!isPasswordValid || userExists.email !== email) {
        throw new Error(constants.ERROR_MESSAGE.INVALID_CREDENTIALS);
    }
    const token = generateToken(userExists.id, userExists.role);
    return token;
}