import { Transaction } from 'sequelize';
import { sequelize } from '../../../config/dbConnection';

export const wrapTransaction = async <T>(
    trans: (transaction: Transaction) => Promise<T>
): Promise<T> => {
    const transaction: Transaction = await sequelize.transaction();
    try {
        const result: T = await trans(transaction);
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
