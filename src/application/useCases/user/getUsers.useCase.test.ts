// Jest test file (ts-jest). Do not introduce new test frameworks unless necessary.
/**
 * Test suite for getUsersUseCase.
 * Testing framework: Jest (TypeScript via ts-jest) — inferred from typical project conventions.
 * These tests focus on the behavior introduced/changed in the PR diff for getUsersUseCase.
 */

import type { Transaction } from "sequelize";

// Attempt to import the use case from the conventional implementation path.
// If your project keeps the function in a different module, update this path accordingly.
import { getUsersUseCase } from "./getUsers.useCase";

// Import constants to assert exact messages and role identifiers.
import { constants } from "../../../infrastructure/config/constants";

// Define a minimal shape for the user port to satisfy type-checking in tests.
type MockUserPort = {
  getUserById: jest.Mock<Promise<any>, [number, Transaction]>;
};

describe("getUsersUseCase", () => {
  let userRepo: MockUserPort;
  let tx: Transaction;

  const ADMIN = constants.ROLES.ADMIN;
  const ERR_NOT_FOUND = constants.ERROR_MESSAGE.USER_NOT_FOUND;
  const ERR_UNAUTHORIZED = constants.ERROR_MESSAGE.UNAUTHORIZED_ACCESS;

  const sampleUserArray = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ];

  beforeEach(() => {
    userRepo = {
      getUserById: jest.fn(),
    };
    // A dummy transaction object; cast to satisfy types without hitting Sequelize
    tx = {} as unknown as Transaction;
    jest.clearAllMocks();
  });

  describe("Admin role behavior", () => {
    it("returns users when role is ADMIN and repository resolves to a list", async () => {
      userRepo.getUserById.mockResolvedValueOnce(sampleUserArray);

      const result = await getUsersUseCase(userRepo as any, tx, ADMIN, /*tokenId*/ 999, /*userId*/ 1);

      expect(userRepo.getUserById).toHaveBeenCalledTimes(1);
      expect(userRepo.getUserById).toHaveBeenCalledWith(1, tx);
      expect(result).toEqual(sampleUserArray);
    });

    it("throws USER_NOT_FOUND when role is ADMIN and repository resolves to null/undefined", async () => {
      userRepo.getUserById.mockResolvedValueOnce(null);

      await expect(
        getUsersUseCase(userRepo as any, tx, ADMIN, /*tokenId*/ 999, /*userId*/ 123)
      ).rejects.toThrow(ERR_NOT_FOUND);

      expect(userRepo.getUserById).toHaveBeenCalledTimes(1);
      expect(userRepo.getUserById).toHaveBeenCalledWith(123, tx);
    });

    it("does not enforce tokenId === userId for ADMIN (token mismatch still allowed)", async () => {
      userRepo.getUserById.mockResolvedValueOnce(sampleUserArray);

      const result = await getUsersUseCase(userRepo as any, tx, ADMIN, /*tokenId*/ 7, /*userId*/ 42);

      expect(userRepo.getUserById).toHaveBeenCalledWith(42, tx);
      expect(result).toEqual(sampleUserArray);
    });
  });

  describe("Non-admin behavior", () => {
    const NON_ADMIN_ROLE = "USER";

    it("throws UNAUTHORIZED_ACCESS when userId !== tokenId", async () => {
      // Ensure the repo is not called in this scenario
      userRepo.getUserById.mockResolvedValueOnce(sampleUserArray);

      await expect(
        getUsersUseCase(userRepo as any, tx, NON_ADMIN_ROLE, /*tokenId*/ 1, /*userId*/ 2)
      ).rejects.toThrow(ERR_UNAUTHORIZED);

      expect(userRepo.getUserById).not.toHaveBeenCalled();
    });

    it("returns user list when userId === tokenId and repository resolves a list", async () => {
      userRepo.getUserById.mockResolvedValueOnce(sampleUserArray);

      const result = await getUsersUseCase(userRepo as any, tx, NON_ADMIN_ROLE, /*tokenId*/ 5, /*userId*/ 5);

      expect(userRepo.getUserById).toHaveBeenCalledTimes(1);
      expect(userRepo.getUserById).toHaveBeenCalledWith(5, tx);
      expect(result).toEqual(sampleUserArray);
    });

    it("throws USER_NOT_FOUND when userId === tokenId but repository resolves to null/undefined", async () => {
      userRepo.getUserById.mockResolvedValueOnce(undefined as any);

      await expect(
        getUsersUseCase(userRepo as any, tx, NON_ADMIN_ROLE, /*tokenId*/ 10, /*userId*/ 10)
      ).rejects.toThrow(ERR_NOT_FOUND);

      expect(userRepo.getUserById).toHaveBeenCalledWith(10, tx);
    });
  });

  describe("Edge cases", () => {
    it("treats non-exact admin role strings as non-admin (e.g., lowercase)", async () => {
      // Lowercase 'admin' should not bypass the token check
      await expect(
        getUsersUseCase(userRepo as any, tx, "admin", /*tokenId*/ 1, /*userId*/ 2)
      ).rejects.toThrow(ERR_UNAUTHORIZED);

      expect(userRepo.getUserById).not.toHaveBeenCalled();
    });

    it("propagates repository rejections as thrown errors", async () => {
      const repoErr = new Error("DB failure");
      userRepo.getUserById.mockRejectedValueOnce(repoErr);

      await expect(
        getUsersUseCase(userRepo as any, tx, constants.ROLES.ADMIN, /*tokenId*/ 0, /*userId*/ 99)
      ).rejects.toThrow("DB failure");

      expect(userRepo.getUserById).toHaveBeenCalledWith(99, tx);
    });
  });
});