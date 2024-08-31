import { UtilityConsumptionReadingEntity } from "../../../domain/entity/utility-consumption-reading-entity";

export interface IUtilityConsumptionRepository {
    utilityConsumptionCheckIfReadingExistsAsync(customer_code: string, measure_datetime: string, measure_type: string): Promise<boolean>;
    utilityConsumptionCreateAsync(customer_code: string, measure_datetime: string, measure_type: string, measure_value: number, measure_uuid: string, image_url: string): Promise<void>;
    getUtilityConsumptionAsync(measure_uuid: string): Promise<UtilityConsumptionReadingEntity | null>;
    utilityConsumptionUpdateConfirmAsync(measure_uuid: string, measure_value: number): Promise<void>;
    getUtilityConsumptionListAsync(customer_code: string, measure_type?: string): Promise<UtilityConsumptionReadingEntity[] | null>;
  }
  