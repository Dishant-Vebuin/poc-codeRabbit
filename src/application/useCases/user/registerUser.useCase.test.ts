/**
 * Tests for registerUserUseCase
 *
 * Assumed testing framework: Jest (with ts-jest for TypeScript).
 * - If the repository uses Vitest, replace jest.fn/jest.mock with vi.fn/vi.mock,
 *   and adjust imports accordingly. Assertions remain compatible.
 *
 * Coverage goals:
 * - Happy path: new user -> hashes password -> persists user -> generates token -> returns token
 * - Duplicate user: throws with USER_ALREADY_EXISTS and does not proceed to hash/register
 * - Propagation of failures: bcrypt.hash rejection + repository.registerUser rejection
 * - Interaction checks: correct parameters to bcrypt.hash, userRepo.registerUser, and generateToken
 * - Role handling: ensure token generation uses the role returned by repository, not just input param
 */

import type { Transaction } from "sequelize";

// Mock external modules imported by the use case
jest.mock("../../../infrastructure/helper/utils/tokenGenerate", () => ({
  generateToken: jest.fn(),
}));

jest.mock("../../../infrastructure/config/constants", () => ({
  constants: {
    ERROR_MESSAGE: {
      USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
    },
  },
}));

// Mock bcrypt default import with a hash function
jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
  },
}));

// Import after mocks so that the mocked versions are used by the module under test
import { registerUserUseCase } from "./registerUser.useCase";
import bcrypt from "bcrypt";
import { generateToken } from "../../../infrastructure/helper/utils/tokenGenerate";
import { constants } from "../../../infrastructure/config/constants";

// Types and helper factories
type MockedFn<T extends (...args: any[]) => any> = jest.Mock<ReturnType<T>, Parameters<T>>;

interface FakeUserRepo {
  getUserByEmail: MockedFn<(email: string, tx: Transaction) => Promise<any>>;
  registerUser: MockedFn<(username: string, email: string, hashedPassword: string, role: string, tx: Transaction) => Promise<{ id: string, role: string }>>;
}

const makeUserRepo = (): FakeUserRepo => ({
  getUserByEmail: jest.fn(),
  registerUser: jest.fn(),
});

const makeTxn = (): Transaction => ({ } as unknown as Transaction);

describe("registerUserUseCase", () => {
  const username = "alice";
  const email = "alice@example.com";
  const password = "S3cr3t!";
  const inputRole = "user";
  const repoUserId = "user-123";
  const repoRole = "admin"; // intentionally different to verify we use repository's role for token

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a token on successful registration (happy path)", async () => {
    const userRepo = makeUserRepo();
    const tx = makeTxn();

    // Arrange mocks
    (bcrypt as any).default.hash.mockResolvedValue(`hashed:${password}`);
    userRepo.getUserByEmail.mockResolvedValue(null);
    userRepo.registerUser.mockResolvedValue({ id: repoUserId, role: repoRole });
    (generateToken as jest.Mock).mockReturnValue("mock-token");

    const token = await registerUserUseCase(username, email, password, inputRole, userRepo as any, tx);

    // Assertions
    expect(userRepo.getUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.getUserByEmail).toHaveBeenCalledWith(email, tx);

    expect((bcrypt as any).default.hash).toHaveBeenCalledTimes(1);
    expect((bcrypt as any).default.hash).toHaveBeenCalledWith(password, 10);

    expect(userRepo.registerUser).toHaveBeenCalledTimes(1);
    const hashedArg = userRepo.registerUser.mock.calls[0][2];
    expect(hashedArg).toBe(`hashed:${password}`);
    expect(hashedArg).not.toBe(password); // ensure hashing occurred
    expect(userRepo.registerUser).toHaveBeenCalledWith(username, email, `hashed:${password}`, inputRole, tx);

    expect(generateToken).toHaveBeenCalledTimes(1);
    expect(generateToken).toHaveBeenCalledWith(repoUserId, repoRole);

    expect(token).toBe("mock-token");
  });

  it("throws USER_ALREADY_EXISTS when a user with the email already exists and does not hash or register", async () => {
    const userRepo = makeUserRepo();
    const tx = makeTxn();

    userRepo.getUserByEmail.mockResolvedValue({ id: "existing-id" });

    await expect(
      registerUserUseCase(username, email, password, inputRole, userRepo as any, tx)
    ).rejects.toThrow(constants.ERROR_MESSAGE.USER_ALREADY_EXISTS);

    // Verify early exit behavior
    expect(userRepo.getUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.registerUser).not.toHaveBeenCalled();
    expect((bcrypt as any).default.hash).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
  });

  it("propagates errors thrown by bcrypt.hash", async () => {
    const userRepo = makeUserRepo();
    const tx = makeTxn();

    userRepo.getUserByEmail.mockResolvedValue(null);
    const hashError = new Error("hash failed");
    (bcrypt as any).default.hash.mockRejectedValue(hashError);

    await expect(
      registerUserUseCase(username, email, password, inputRole, userRepo as any, tx)
    ).rejects.toThrow("hash failed");

    expect(userRepo.registerUser).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
  });

  it("propagates errors thrown by userRepo.registerUser", async () => {
    const userRepo = makeUserRepo();
    const tx = makeTxn();

    userRepo.getUserByEmail.mockResolvedValue(null);
    (bcrypt as any).default.hash.mockResolvedValue("hashed-value");
    const repoError = new Error("db insert failed");
    userRepo.registerUser.mockRejectedValue(repoError);

    await expect(
      registerUserUseCase(username, email, password, inputRole, userRepo as any, tx)
    ).rejects.toThrow("db insert failed");

    expect(generateToken).not.toHaveBeenCalled();
  });

  it("uses the role returned from repository when generating the token (not just input role)", async () => {
    const userRepo = makeUserRepo();
    const tx = makeTxn();

    userRepo.getUserByEmail.mockResolvedValue(null);
    (bcrypt as any).default.hash.mockResolvedValue("hashed-value");
    userRepo.registerUser.mockResolvedValue({ id: repoUserId, role: repoRole });
    (generateToken as jest.Mock).mockReturnValue("role-aware-token");

    const token = await registerUserUseCase(username, email, password, inputRole, userRepo as any, tx);

    expect(generateToken).toHaveBeenCalledWith(repoUserId, repoRole);
    expect(token).toBe("role-aware-token");
  });

  it("accepts unexpected/edge input values and still attempts hashing and registration", async () => {
    const userRepo = makeUserRepo();
    const tx = makeTxn();

    const weirdUsername = "";
    const weirdEmail = "not-an-email";
    const weirdPassword = "";
    const weirdRole = "";

    userRepo.getUserByEmail.mockResolvedValue(null);
    (bcrypt as any).default.hash.mockResolvedValue("hashed-empty");
    userRepo.registerUser.mockResolvedValue({ id: "edge-id", role: "" });
    (generateToken as jest.Mock).mockReturnValue("edge-token");

    const token = await registerUserUseCase(
      weirdUsername,
      weirdEmail,
      weirdPassword,
      weirdRole,
      userRepo as any,
      tx
    );

    expect((bcrypt as any).default.hash).toHaveBeenCalledWith(weirdPassword, 10);
    expect(userRepo.registerUser).toHaveBeenCalledWith(
      weirdUsername,
      weirdEmail,
      "hashed-empty",
      weirdRole,
      tx
    );
    expect(token).toBe("edge-token");
  });
});