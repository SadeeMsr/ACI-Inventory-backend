import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  productCount: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

export const Category = model<ICategory>('Category', categorySchema); 