import dotenv from 'dotenv';
dotenv.config();

const envString = (data: string | undefined): string => {
  if (!data) {
    return '';
  } else {
    return data;
  }
};
const envNumber = (data: string | undefined): number => {
  if (!data) {
    return 0;
  } else {
    return Number(data);
  }
};

export const ENVIRONMENT = envNumber(process.env.IS_TESTING);

export const TEST_ENV = {
  DB_NAME_TEST: envString(process.env.DB_NAME_TEST),
  DB_HOST_TEST: envString(process.env.DB_HOST_TEST),
  DB_USERNAME_TEST: envString(process.env.DB_USERNAME_TEST),
  DB_PASSWORD_TEST: envString(process.env.DB_PASSWORD_TEST),
  SERVER_PORT_TEST: envNumber(process.env.PORT_TEST),
  FRONTEND_URL: envString(process.env.FRONTEND_URL),
  JWT_ACCESS_SECRET: envString(process.env.JWT_ACCESS_SECRET),
};
export const DEV_ENV = {
  PORT_DEV: envNumber(process.env.PORT),
  DB_NAME_DEV: envString(process.env.DB_NAME_DEV),
  DB_HOST_DEV: envString(process.env.DB_HOST_DEV),
  DB_USERNAME_DEV: envString(process.env.DB_USERNAME_DEV),
  DB_PASSWORD_DEV: envString(process.env.DB_PASSWORD_DEV),
  SERVER_PORT_DEV: envNumber(process.env.SERVER_PORT_DEV),
  FRONTEND_URL: envString(process.env.FRONTEND_URL),
  JWT_ACCESS_SECRET: envString(process.env.JWT_ACCESS_SECRET),
};
