import { Request } from 'express';

export interface IConfirmRequest extends Request {
  body: {
    measure_uuid: string;
    confirmed_value: number;
  };
}