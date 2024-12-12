import { Model, Document } from 'mongoose';

export abstract class BaseService<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findAll(filter = {}): Promise<T[]> {
    return this.model.find(filter);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }
} 