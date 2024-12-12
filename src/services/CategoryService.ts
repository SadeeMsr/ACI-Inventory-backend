import { BaseService } from './BaseService';
import { Category, ICategory } from '../models/Category';
import { Product } from '../models/Product';

export class CategoryService extends BaseService<ICategory> {
  constructor() {
    super(Category);
  }

  async createCategory(name: string): Promise<ICategory> {
    const existingCategory = await this.model.findOne({ name });
    if (existingCategory) {
      throw new Error(`Category "${name}" already exists`);
    }
    return this.create({ name });
  }

  async getCategoryStats(): Promise<Array<{ category: string; count: number }>> {
    return Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } }
    ]);
  }

  async getAnalytics() {
    const [productsByCategory, totalProducts, recentProducts] = await Promise.all([
      this.getCategoryStats(),
      Product.countDocuments(),
      Product.find().sort({ createdAt: -1 }).limit(5)
    ]);

    return {
      productsByCategory,
      recentProducts,
      totalProducts,
      totalCategories: productsByCategory.length
    };
  }
} 