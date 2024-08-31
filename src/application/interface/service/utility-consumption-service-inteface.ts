import { IConfirmRequest } from '../request/confirm-request-interface';
import { IGetRequest } from '../request/get-request-interface';
import { IUploadRequest } from '../request/upload-request-interface';
import { IConfirmResponse } from '../response/confirm-response-interface';
import { IGetResponse } from '../response/get-response-interface';
import { IUploadResponse } from '../response/upload-response-interface';

export interface IUtilityConsumptionService {
  upload(req: IUploadRequest): Promise<IUploadResponse>;
  confirm(req: IConfirmRequest): Promise<IConfirmResponse>;
  get(req: IGetRequest): Promise<IGetResponse>;
}
