import { MongoClient } from 'mongodb';
import { IUtilityConsumptionRepository } from '../application/interface/repository/utility-consumption-repository-interface';
import { UtilityConsumptionReadingEntity } from '../domain/entity/utility-consumption-reading-entity';

export class UtilityConsumptionRepository  implements IUtilityConsumptionRepository{
  private client: MongoClient;
  private databaseName: string;
  private collectionName: string;

  constructor(databaseName: string, collectionName: string) {
    const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/';
    this.client = new MongoClient(connectionString);
    this.databaseName = databaseName;
    this.collectionName = collectionName;
  }

  async utilityConsumptionCheckIfReadingExistsAsync(customer_code: string, measure_datetime: string, measure_type: string): Promise<boolean> {
    try {
      await this.client.connect();
      const database = this.client.db(this.databaseName);
      const readings = database.collection(this.collectionName);

      const startOfMonth = new Date(measure_datetime);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      const existingReading = await readings.findOne({
        customer_code: customer_code,
        measure_type: measure_type,
        measure_datetime: {
          $gte: startOfMonth,
          $lt: endOfMonth
        }
      });

      return !!existingReading;
    } finally {
      await this.client.close();
    }
  }
  async getUtilityConsumptionAsync(measure_uuid: string): Promise<UtilityConsumptionReadingEntity | null> {
    try {
      await this.client.connect();
      const database = this.client.db(this.databaseName);
      const readings = database.collection(this.collectionName);
      const existingReading = await readings.findOne({
        measure_uuid: measure_uuid,
      });
  
      if (existingReading) {
        return new UtilityConsumptionReadingEntity(existingReading);
      } else {
        return null;
      }
    } finally {
      await this.client.close();
    }
  }

  async getUtilityConsumptionListAsync(customer_code: string, measure_type?: string): Promise<UtilityConsumptionReadingEntity[] | null> {
    try {
      await this.client.connect();
      const database = this.client.db(this.databaseName);
      const readings = database.collection(this.collectionName);
  
      const query: any = { customer_code: customer_code };
      if (measure_type) {
        query.measure_type = measure_type;
      }
  
      const cursor = readings.find(query);
      const existingReadings = await cursor.toArray();
  
      if (existingReadings.length > 0) {
        return existingReadings.map(reading => new UtilityConsumptionReadingEntity(reading));
      } else {
        return null;
      }
    } finally {
      await this.client.close();
    }
  }
  
  
  async utilityConsumptionCreateAsync(customer_code: string, measure_datetime: string, measure_type: string, measure_value: number, measure_uuid: string, image_url: string): Promise<void> {
    try {
      await this.client.connect();
      const database = this.client.db(this.databaseName);
      const readings = database.collection(this.collectionName);

      const newReading: UtilityConsumptionReadingEntity = {
        customer_code: customer_code,
        measure_datetime: new Date(measure_datetime),
        measure_type: measure_type,
        measure_value: measure_value,
        measure_uuid: measure_uuid,
        created_at: new Date(),
        confirm_measure_value: false,
        image_url: image_url
      };

      await readings.insertOne(newReading);
    } finally {
      await this.client.close();
    }
  }
  async utilityConsumptionUpdateConfirmAsync(measure_uuid: string, measure_value: number): Promise<void> {
    try {
      await this.client.connect();
      const database = this.client.db(this.databaseName);
      const readings = database.collection(this.collectionName);
  
      const result = await readings.updateOne(
        { measure_uuid: measure_uuid },
        { $set: { confirm_measure_value: true, measure_value: measure_value } }
      );
  
      if (result.modifiedCount === 0) {
        throw new Error('Leitura não encontrada ou não atualizada');
      }
  
    } finally {
      await this.client.close();
    }
  }
  
  
}
