import { Application, Request, Response } from 'express';
import { createController } from '../controllers/utility-consumption-controller';
import { IGetRequest } from '../../application/interface/request/get-request-interface';

export const registerRoutes = (app: Application): void => {
  const controller = createController();

  /**
 * @swagger
 * tags:
 *   name: Utility Consumption
 *   description: Responsável por receber uma imagem em base 64, consultar o Gemini e retornar a medida lida pela API
 *
 * /api/v1/utilityConsumption/upload:
 *   post:
 *     summary: Faz o upload de uma imagem com os dados de medição
 *     tags: [Utility Consumption]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *               customer_code:
 *                 type: string
 *               measure_datetime:
 *                 type: string
 *                 format: date-time
 *               measure_type:
 *                 type: string
 *                 enum: [WATER, GAS]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid request
 *       409:
 *         description: There is already a reading for this type in the current month
 */

  app.route('/api/v1/utilityConsumption/upload')
    .post((req: Request, res: Response) => {
      const { image, customer_code, measure_datetime, measure_type } = req.body;

      if (!image || !customer_code || !measure_datetime || !measure_type) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      controller.upload(req, res);
    });

  /**
 * @swagger
 * tags:
 *   name: Utility Consumption
 *   description: Responsável por confirmar ou corrigir o valor lido pelo LLM
 *
 * /api/v1/utilityConsumption/confirm:
 *   patch:
 *     summary: confirmar ou corrigir o valor lido pelo LLM
 *     tags: [Utility Consumption]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               measure_uuid:
 *                 type: string
 *               confirmed_value:
 *                 type: number
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Reading not found
 *       409:
 *         description: Reading already confirmed
 */

  app.route('/api/v1/utilityConsumption/confirm')
  .patch((req: Request, res: Response) => {
    const { measure_uuid, confirmed_value } = req.body;

    if (!measure_uuid || !confirmed_value) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }
    controller.confirm(req, res);
  });

/**
 * @swagger
 * tags:
 *   name: Utility Consumption
 *   description: Responsável por listar as medidas realizadas por um determinado cliente
 *
 * /api/v1/utilityConsumption/{customer_code}/list:
 *   get:
 *     summary: Listar as medidas realizadas por um determinado cliente
 *     tags: [Utility Consumption]
 *     parameters:
 *       - name: customer_code
 *         in: path
 *         required: true
 *         description: Código do cliente
 *         schema:
 *           type: string
 *       - name: measure_type
 *         in: query
 *         required: false
 *         description: Tipo de medição (WATER, GAS)
 *         schema:
 *           type: string
 *           enum: [WATER, GAS]
 *     responses:
 *       200:
 *         description: Sucesso
 *       400:
 *         description: Requisição inválida
 *       404:
 *         description: Leitura não encontrada
 */

app.route('/api/v1/utilityConsumption/:customer_code/list')
  .get((req: IGetRequest, res: Response) => {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    if (!customer_code) {
      return res.status(400).json({ message: "O código do cliente é obrigatório" });
    }

    // Aqui você pode adicionar a lógica para chamar o controlador
    controller.get(req, res);
  });

};
