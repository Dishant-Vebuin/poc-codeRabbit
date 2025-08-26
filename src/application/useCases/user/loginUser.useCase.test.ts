// Note: Jest assumed as the testing library and framework. If the project uses Vitest, these tests are compatible with minimal changes.
// Tests for loginUserUseCase
// Testing library/framework: Jest (assumed). If using Vitest, replace jest.fn() with vi.fn() and jest.mock with vi.mock, etc.

import type { Transaction } from "sequelize";

// Import the unit under test
// If the actual implementation file resides at a different path (e.g., loginUser.useCase.ts),
// adjust the import accordingly. We are following the repository structure hinted by the snippet.
import { loginUserUseCase } from "./loginUser.useCase";

// Dependencies to be mocked
import bcrypt from "bcrypt";
import { generateToken } from "../../../infrastructure/helper/utils/tokenGenerate";
import { constants } from "../../../infrastructure/config/constants";
import type { userPort } from "../../port/user/userRepo.port";

// Jest mocks for external modules
jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    compare: jest.fn(),
  },
}));

jest.mock("../../../infrastructure/helper/utils/tokenGenerate", () => ({
  __esModule: true,
  generateToken: jest.fn(),
}));

// Build a simple factory for a mock user and repo
type UserEntity = {
  id: string | number;
  email: string;
  password: string;
  role: string;
};

const mockTransaction = {} as unknown as Transaction;

const makeUser = (overrides: Partial<UserEntity> = {}): UserEntity => ({
  id: "user-123",
  email: "test@example.com",
  password: "$2b$10$hashedpassword",
  role: "user",
  ...overrides,
});

const makeUserRepo = (overrides?: {
  getUserByEmail?: (email: string, t: Transaction) => Promise<UserEntity | null>;
}): userPort =>
  ({
    // Only defining the method used in this use case to keep the mock minimal
    getUserByEmail:
      overrides?.getUserByEmail ??
      (jest.fn(async (_email: string, _t: Transaction) => makeUser()) as any),
  } as unknown as userPort);

describe("loginUserUseCase", () => {
  const bcryptCompare = (bcrypt as any).default.compare as jest.Mock;
  const genToken = generateToken as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws USER_NOT_FOUND when repository returns null", async () => {
    const repo = makeUserRepo({
      getUserByEmail: jest.fn(async () => null),
    });

    await expect(
      loginUserUseCase("absent@example.com", "any-password", repo, mockTransaction)
    ).rejects.toThrow(constants.ERROR_MESSAGE.USER_NOT_FOUND);

    expect(repo.getUserByEmail).toHaveBeenCalledWith(
      "absent@example.com",
      mockTransaction
    );
    expect(bcryptCompare).not.toHaveBeenCalled();
    expect(genToken).not.toHaveBeenCalled();
  });

  it("throws INVALID_CREDENTIALS when bcrypt.compare returns false", async () => {
    const repo = makeUserRepo();
    bcryptCompare.mockResolvedValueOnce(false);

    await expect(
      loginUserUseCase("test@example.com", "wrong-password", repo, mockTransaction)
    ).rejects.toThrow(constants.ERROR_MESSAGE.INVALID_CREDENTIALS);

    expect(repo.getUserByEmail).toHaveBeenCalledWith(
      "test@example.com",
      mockTransaction
    );
    expect(bcryptCompare).toHaveBeenCalledWith(
      "wrong-password",
      makeUser().password
    );
    expect(genToken).not.toHaveBeenCalled();
  });

  it("throws INVALID_CREDENTIALS when the email returned from repo does not match input", async () => {
    const user = makeUser({ email: "different@example.com" });
    const repo = makeUserRepo({
      getUserByEmail: jest.fn(async () => user),
    });
    bcryptCompare.mockResolvedValueOnce(true);

    await expect(
      loginUserUseCase("test@example.com", "correct-password", repo, mockTransaction)
    ).rejects.toThrow(constants.ERROR_MESSAGE.INVALID_CREDENTIALS);

    expect(repo.getUserByEmail).toHaveBeenCalledWith(
      "test@example.com",
      mockTransaction
    );
    expect(bcryptCompare).toHaveBeenCalledWith("correct-password", user.password);
    expect(genToken).not.toHaveBeenCalled();
  });

  it("returns token on valid credentials and matching email", async () => {
    const user = makeUser();
    const repo = makeUserRepo({
      getUserByEmail: jest.fn(async () => user),
    });
    bcryptCompare.mockResolvedValueOnce(true);
    genToken.mockReturnValueOnce("signed.jwt.token");

    const token = await loginUserUseCase(
      "test@example.com",
      "correct-password",
      repo,
      mockTransaction
    );

    expect(token).toBe("signed.jwt.token");
    expect(repo.getUserByEmail).toHaveBeenCalledWith(
      "test@example.com",
      mockTransaction
    );
    expect(bcryptCompare).toHaveBeenCalledWith("correct-password", user.password);
    expect(genToken).toHaveBeenCalledWith(user.id, user.role);
  });

  it("propagates unexpected errors from bcrypt.compare", async () => {
    const user = makeUser();
    const repo = makeUserRepo({
      getUserByEmail: jest.fn(async () => user),
    });
    const err = new Error("bcrypt failure");
    bcryptCompare.mockRejectedValueOnce(err);

    await expect(
      loginUserUseCase("test@example.com", "pw", repo, mockTransaction)
    ).rejects.toThrow("bcrypt failure");

    expect(repo.getUserByEmail).toHaveBeenCalled();
    expect(bcryptCompare).toHaveBeenCalled();
    expect(genToken).not.toHaveBeenCalled();
  });

  it("is strict about email case (mismatch should fail)", async () => {
    const user = makeUser({ email: "Test@Example.com" });
    const repo = makeUserRepo({
      getUserByEmail: jest.fn(async () => user),
    });
    bcryptCompare.mockResolvedValueOnce(true);

    await expect(
      loginUserUseCase("test@example.com", "correct-password", repo, mockTransaction)
    ).rejects.toThrow(constants.ERROR_MESSAGE.INVALID_CREDENTIALS);
  });

  it("passes the provided transaction through to the repository", async () => {
    const spy = jest.fn(async () => makeUser());
    const tx = { dummy: true } as unknown as Transaction;
    const repo = makeUserRepo({ getUserByEmail: spy });
    bcryptCompare.mockResolvedValueOnce(true);
    genToken.mockReturnValueOnce("token");

    await loginUserUseCase("test@example.com", "pw", repo, tx);

    expect(spy).toHaveBeenCalledWith("test@example.com", tx);
  });
});