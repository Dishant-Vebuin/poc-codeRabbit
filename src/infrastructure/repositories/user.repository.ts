import { Transaction } from "sequelize";
import { userPort } from "../../application/port/user/userRepo.port";
import { wrapTransaction } from '../helper/middleware/transaction';
import Users from '../orm/entities/task-management/user.entity';
import { LoginUserDetails, UserDetails } from '../../domain/models/user.type';

export const userRepository: userPort = {
    wrapTransaction,
    registerUser: async (username: string, email: string, password: string, role: string, transaction: Transaction) => {
        const user = await Users
            .create({ username, email, password, role }, { transaction });
        const userId = user.dataValues.id;
        const userRole = user.dataValues.role;
        return { id: userId, role: userRole };
    },
    getUserByEmail: async (email: string, transaction: Transaction): Promise<LoginUserDetails | null> => {
        const user = await Users.findOne({
            where: { email },
            transaction,
            attributes: ['id', 'email', 'password', 'role', 'username'],
            raw: true,
        });
        return (user as unknown as LoginUserDetails) ?? null;
    },
    getUserById: async (userId: number, transaction: Transaction): Promise<UserDetails | null> => {
        const user = await Users.findOne({
            where: { id: userId },
            transaction
        });
        if (user) {
            return user.dataValues;
        }
        return null;
    },
}