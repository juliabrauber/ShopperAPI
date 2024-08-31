import { Request } from 'express';

export interface IUploadRequest extends Request {
  body: {
    image: string;
    customer_code: string;
    measure_datetime: string;
    measure_type: string;
  };
}