import Express from 'express';
export const displayMessage = <T>(
  code: number,
  msg: string,
  success: boolean,
  res: Express.Response,
  data?: T
) => {
  return res.status(code).send({
    success: success,
    message: msg,
    data: data,
  });
};
