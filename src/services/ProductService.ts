import { BaseService } from './BaseService';
import { Product, IProduct } from '../models/Product';

interface ExternalAPIResponse {
  status: boolean;
  product?: {
    material: number;
    barcode: string;
    description: string;
    quantity: number;
    category: string;
  };
  error?: string;
}

export class ProductService extends BaseService<IProduct> {
  constructor() {
    super(Product);
  }

  async findByBarcode(barcode: string): Promise<IProduct | null> {
    return this.model.findOne({ barcode });
  }

  async fetchFromExternalAPI(barcode: string): Promise<ExternalAPIResponse['product']> {
    const response = await fetch(`https://products-test-aci.onrender.com/product/${barcode}`);
    const data = await response.json() as ExternalAPIResponse;
    
    if (!data.status || !data.product) {
      throw new Error(data.error || 'Product not found in external API');
    }
    
    return data.product;
  }

  async addProductFromBarcode(barcode: string): Promise<IProduct> {
    const existingProduct = await this.findByBarcode(barcode);
    if (existingProduct) {
      return existingProduct;
    }

    const externalProduct = await this.fetchFromExternalAPI(barcode);
    return this.create({
      ...externalProduct,
      status: 'Uncategorized',
      category: 'Uncategorized', 
      quantity: 1 
    });
  }

  async updateCategory(productId: string, category: string): Promise<IProduct | null> {
    const product = await this.update(productId, { category });
    if (product) {
      await this.model.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        {
          $merge: {
            into: 'categories',
            on: ['name'],
            whenMatched: 'merge',
            whenNotMatched: 'insert'
          }
        }
      ]);
    }
    return product;
  }

  async updateStatus(productId: string, status: string): Promise<IProduct | null> {
    return this.update(productId, { status: status });
  }

  async findAll({ category, status }: { category?: string; status?: string } = {}) {
    return super.findAll({
      ...(category && { category }),
      ...(status && { status })
    });
  }

  async updateManyByStatus(oldStatus: string, newStatus: string): Promise<void> {
    await this.model.updateMany(
      { status: oldStatus },
      { $set: { status: newStatus } }
    );
  }
}