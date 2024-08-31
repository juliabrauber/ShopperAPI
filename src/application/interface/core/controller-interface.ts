import { Request, Response } from 'express';
import { IGetRequest } from '../request/get-request-interface';

export interface IController {
    upload: (req: Request, res: Response) => Promise<Response>;
    confirm: (req: Request, res: Response) => Promise<Response>;
    get: (req: IGetRequest, res: Response) => Promise<Response>;
  }