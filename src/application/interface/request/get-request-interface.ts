import { Request } from 'express';

export interface IGetRequest extends Request {
  params: {
    customer_code: string;
  };
  query: {
    measure_type?: string;
  };
}
