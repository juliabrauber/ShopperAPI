import { IUploadRequest } from '../interface/request/upload-request-interface';
import { v4 as uuidv4 } from 'uuid';
import { IUtilityConsumptionService } from '../interface/service/utility-consumption-service-inteface';
import { IUploadResponse } from '../interface/response/upload-response-interface';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UtilityConsumptionRepository } from '../../repository/utility-consumption-repository';
import { IUtilityConsumptionRepository } from '../interface/repository/utility-consumption-repository-interface';
import { IConfirmRequest } from '../interface/request/confirm-request-interface';
import { IConfirmResponse } from '../interface/response/confirm-response-interface';
import { IGetResponse } from '../interface/response/get-response-interface';
import { IGetRequest } from '../interface/request/get-request-interface';


export class UtilityConsumptionService implements IUtilityConsumptionService {

    private readonly repository: IUtilityConsumptionRepository;

    constructor() {
        this.repository = new UtilityConsumptionRepository('consumption', 'utility-consumption');
    }

    async get(req: IGetRequest): Promise<IGetResponse> {
        const { customer_code } = req.params;
        const { measure_type } = req.query;

        if (!customer_code) {
            throw new Error('MEASURES_NOT_FOUND');
        }
        if (measure_type && !this.isValidMeasureType(measure_type)) {
            throw new Error('INVALID_TYPE');
        }

        const consumptionReadingEntityList = await this.repository.getUtilityConsumptionListAsync(customer_code, measure_type);
        
        if (!consumptionReadingEntityList || !consumptionReadingEntityList.length) {
            throw new Error('MEASURES_NOT_FOUND');
        }

        const response: IGetResponse = {
            customer_code: customer_code,
            measures: consumptionReadingEntityList.map(entity => ({
              measure_uuid: entity.measure_uuid,
              measure_datetime: entity.measure_datetime,
              measure_type: entity.measure_type,
              has_confirmed: entity.confirm_measure_value,
              image_url: entity.image_url,
            }))
          };
        return response;
    }

    async confirm(req: IConfirmRequest): Promise<IConfirmResponse> {
        const { measure_uuid, confirmed_value } = req.body;
        if (!measure_uuid || !confirmed_value) {
            throw new Error('INVALID_DATA');
        }

        const consumptionReadingEntity = await this.repository.getUtilityConsumptionAsync(measure_uuid);
        
        if (!consumptionReadingEntity) {
            throw new Error('MEASURE_NOT_FOUND');
        }

        if (consumptionReadingEntity?.confirm_measure_value) {
            throw new Error('CONFIRMATION_DUPLICATE');
        }

        await this.repository.utilityConsumptionUpdateConfirmAsync(measure_uuid, confirmed_value);

        const response: IConfirmResponse = {
            success: true
        }

        return response;
    }

    async upload(req: IUploadRequest): Promise<IUploadResponse> {
        const { image, customer_code, measure_datetime, measure_type } = req.body;
        if (!this.isValidBase64(image)) {
            throw new Error('INVALID_DATA');
        }

        if (!this.isValidMeasureType(measure_type)) {
            throw new Error('INVALID_DATA');
        }

        if (await this.isDoubleReport(customer_code, measure_datetime, measure_type)) {
            throw new Error('DOUBLE_REPORT');
        }
        const response = await this.getLLMResponse(image, measure_type);
        const uploadResponse: IUploadResponse = {
            image_url: response.image_url,
            measure_value: Number(response.measure_value),
            measure_uuid: uuidv4(),
        };

        await this.repository.utilityConsumptionCreateAsync(customer_code, measure_datetime, measure_type, uploadResponse.measure_value, uploadResponse.measure_uuid, response.image_url);

        return uploadResponse;
    }

    private isValidBase64(base64: string): boolean {
        const base64Pattern = /^(?:[A-Z0-9+/]{4})*?(?:[A-Z0-9+/]{2}(?:==)|[A-Z0-9+/]{3}=)?$/i;
        return base64Pattern.test(base64);
    }

    private isValidMeasureType(measureType: string): boolean {
        return ['WATER', 'GAS'].includes(measureType.toUpperCase());
    }

    private async isDoubleReport(customer_code: string, measure_datetime: string, measure_type: string): Promise<boolean> {
        const exists = await this.repository.utilityConsumptionCheckIfReadingExistsAsync(customer_code, measure_datetime, measure_type);
        return exists;
    }

    private async getLLMResponse(base64Image: string, measureType: string): Promise<{ image_url: string; measure_value: number }> {
        debugger;
        const apiKey = process.env.GEMINI_API_KEY ?? '';
        const prompt = `
        What is the current consumption of the photo of this ${measureType} meter that is in the image in base64?
        Return only a JSON with the following details: 
        { 
            "image_url": "(A temporary link to the image generated by you for the provided image)", 
            "measure_value": "(Current consumption taken from the water meter)" 
        }
        `;
        const image = {
            inlineData: {
                data: base64Image,
                mimeType: "image/png",
            },
        };
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([prompt, image]);
        let responseText = result.response.text();
        responseText = responseText.replace(/```json\n/g, '').replace(/\n```/g, '');

        try {
            const responseJson = JSON.parse(responseText);
            const { image_url, measure_value } = responseJson;
            return { image_url, measure_value };
        } catch (error) {
            console.error('Erro ao processar a resposta da API:', error);
            throw new Error('A resposta não está no formato JSON esperado');
        }
    }
}
