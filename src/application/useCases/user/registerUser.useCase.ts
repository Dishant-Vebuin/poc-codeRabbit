import { Transaction } from "sequelize";
import { userPort } from "../../port/user/userRepo.port";
import { constants } from "../../../infrastructure/config/constants";
import { generateToken } from "../../../infrastructure/helper/utils/tokenGenerate";
import bcrypt from "bcrypt";

export const registerUserUseCase = async (username: string, email: string, password: string, role: string, userRepo: userPort, transaction: Transaction): Promise<string> => {
    const existingUser = await userRepo.getUserByEmail(email, transaction);
    if (existingUser) {
        throw new Error(constants.ERROR_MESSAGE.USER_ALREADY_EXISTS)
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userRepo.registerUser(username, email, hashedPassword, role, transaction);
    const token = generateToken(result.id, result.role);
    return token
}