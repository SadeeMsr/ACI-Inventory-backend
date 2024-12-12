import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  material: number;
  barcode: string;
  description: string;
  quantity: number;
  category: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema({
  material: { type: Number, required: true },
  barcode: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  status: { 
    type: String, 
    default: 'Uncategorized'
  }
}, {
  timestamps: true
});

export const Product = model<IProduct>('Product', productSchema); 