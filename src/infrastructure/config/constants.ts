export const constants = {
  OTP_EXPIRE_TIME: 15,
  SUCCESS_STATUS: {
    OK: 200,
    CREATED: 201,
  },
  SUCCESS_MESSAGE: {
    EMPLOYEE_ADDED: 'Employee added successfully',
    EMPLOYEE_DELETED: 'Employee deleted successfully',
    EMPLOYEE_UPDATED: 'Employee updated successfully',
    EMPLOYEE_FETCHED: 'Employees fetched successfully',
  },
  ERROR_STATUS: {
    BAD_REQUEST: 400,
    AUTHENTICATION_FAILED: 401,
    ACCESS_TOKEN_MISSING: 402,
    JWT_ERROR: 403,
    ACCESS_DENIED: 403,
    NOT_FOUND: 404,
    JWT_TOKEN_EXPIRED_ERROR: 406,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },
  ERROR_MESSAGE: {
    EMPLOYEE_ALREADY_EXISTS: 'Employee Already Exists',
    EMPLOYEE_NOT_FOUND: 'Employee not found',
  },

  DEFAULT_PARAMS: {
    LIMIT: 10,
    MAX_PRICE: 1000,
    MIN_PRICE: 10,
    PAGE: 1,
    RATING: 0,
    SLOTS: 0,
    RADIUS: 5,
  },
};
