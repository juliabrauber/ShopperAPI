import { Request, Response } from 'express';
import { IController } from '../../application/interface/core/controller-interface';
import { IUtilityConsumptionService } from '../../application/interface/service/utility-consumption-service-inteface';
import { UtilityConsumptionService } from '../../application/service/utility-consumption-service';
import { IGetRequest } from '../../application/interface/request/get-request-interface';

export const createController = (): IController => {
  const utilityConsumptionService: IUtilityConsumptionService = new UtilityConsumptionService();

  const controller: IController = {
    upload: async (req: Request, res: Response): Promise<Response> => {
      try {
        const uploadResponse = await utilityConsumptionService.upload(req);
        return res.status(200).json(uploadResponse);
      } catch (error: any) {
        if (error.message === 'INVALID_DATA') {
          return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
          });
        }

        if (error.message === 'DOUBLE_REPORT') {
          return res.status(409).json({
            error_code: 'DOUBLE_REPORT',
            error_description: 'Leitura do mês já realizada',
          });
        }
        console.log(res.json);
        return res.status(500).json({
          error_code: 'INTERNAL_ERROR',
          error_description: 'Erro interno do servidor',
        });
      }
    },
    confirm: async (req: Request, res: Response): Promise<Response> => {
      try {
        const confirmResponse = await utilityConsumptionService.confirm(req);
        return res.status(200).json(confirmResponse);
      } catch (error: any) {
        if (error.message === 'INVALID_DATA') {
          return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
          });
        }
        if (error.message === 'MEASURE_NOT_FOUND') {
          return res.status(404).json({
            error_code: 'MEASURE_NOT_FOUND',
            error_description: '"Leitura do mês não encontrada',
          });
        }
        if (error.message === 'CONFIRMATION_DUPLICATE') {
          return res.status(409).json({
            error_code: 'CONFIRMATION_DUPLICATE',
            error_description: 'Leitura do mês já realizada',
          });
        }
        console.log(res.json);
        return res.status(500).json({
          error_code: 'INTERNAL_ERROR',
          error_description: 'Erro interno do servidor',
        });
      }
    },

    get: async (req: IGetRequest, res: Response): Promise<Response> => {
      try {
        const getResponse = await utilityConsumptionService.get(req);
        return res.status(200).json(getResponse);
      } catch (error: any) {
        if (error.message === 'INVALID_TYPE') {
          return res.status(400).json({
            error_code: 'INVALID_TYPE',
            error_description: 'Tipo de medição não permitida',
          });
        }
        if (error.message === 'MEASURES_NOT_FOUND') {
          return res.status(404).json({
            error_code: 'MEASURE_NOT_FOUND',
            error_description: 'Nenhuma leitura encontrada',
          });
        }
        console.log(error);
        return res.status(500).json({
          error_code: 'INTERNAL_ERROR',
          error_description: 'Erro interno do servidor',
        });
      }
    },
  };

  return controller;
};
