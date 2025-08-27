import { Transaction } from "sequelize";
import { LoginUserDetails, UserDetails } from "../../../domain/models/user.type";

export type userPort = {
registerUser(username: string, email: string, password: string, role: string, transaction: Transaction): Promise<{id: number, role: string}>;
getUserByEmail(email: string, transaction: Transaction): Promise<LoginUserDetails | null>;
getUserById(userId: number, transaction: Transaction): Promise<UserDetails | null>;
wrapTransaction: <T>(fun: (transaction: Transaction) => Promise<T>) => Promise<T>;
}