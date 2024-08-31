
export interface IGetResponse {
  customer_code: string;
  measures: IMeasure[];
  }

  export interface IMeasure {
    measure_uuid: string; 
    measure_datetime: Date;
    measure_type: string;
    has_confirmed: boolean; 
    image_url: string;          
  }
  