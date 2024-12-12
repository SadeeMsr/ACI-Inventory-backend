import dotenv from 'dotenv';
dotenv.config();

class Config {
  public readonly port: number;
  public readonly mongoUri: string;
  public readonly nodeEnv: string;
  public readonly externalApiUrl: string;

  constructor() {
    this.port = parseInt(process.env.PORT || '4000', 10);
    this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory';
    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.externalApiUrl = 'https://products-test-aci.onrender.com';
  }

  public isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }
}

export const config = new Config(); 