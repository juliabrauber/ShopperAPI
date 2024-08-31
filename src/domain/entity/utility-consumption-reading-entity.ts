export class UtilityConsumptionReadingEntity {
    customer_code: string;
    measure_datetime: Date;
    measure_type: string;
    measure_value: number;
    measure_uuid: string;
    created_at: Date;
    confirm_measure_value: boolean;
    image_url: string;
  
    constructor(data: any) {
      this.customer_code = data.customer_code;
      this.measure_datetime = new Date(data.measure_datetime);
      this.measure_type = data.measure_type;
      this.measure_value = data.measure_value;
      this.measure_uuid = data.measure_uuid;
      this.created_at = new Date(data.created_at);
      this.confirm_measure_value = data.confirm_measure_value;
      this.image_url = data.image_url;
    }
  }
  