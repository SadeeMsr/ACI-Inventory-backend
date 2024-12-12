import { BaseResolver } from './BaseResolver';
import { ProductService } from '../../services/ProductService';
import { GraphQLError } from 'graphql';

interface ProductQueryArgs {
  category?: string;
  status?: string;
}

interface ProductBarcodeArgs {
  barcode: string;
}

interface ProductUpdateArgs {
  productId: string;
  status?: string;
  category?: string;
}

export class ProductResolver extends BaseResolver {
  constructor(private productService: ProductService) {
    super();
  }

  Query = {
    products: async (_: any, { category, status }: ProductQueryArgs) => {
      const data = await this.productService.findAll({ category, status });
      return data;
    },

    productByBarcode: async (_: any, { barcode }: ProductBarcodeArgs) => {
      return this.tryExecute(async () => {
        try {
          const product = await this.productService.addProductFromBarcode(barcode);
          return {
            status: true,
            product,
            error: null
          };
        } catch (error) {
          return {
            status: false,
            product: null,
            error: error instanceof Error ? error.message : 'Failed to process barcode'
          };
        }
      });
    }
  };

  Mutation = {
    addProduct: async (_: any, { barcode }: ProductBarcodeArgs) => {
      return this.tryExecute(async () => {
        const product = await this.productService.addProductFromBarcode(barcode);
        return {
          status: true,
          product,
          error: null
        };
      });
    },

    updateProductStatus: async (_: any, { productId, status }: ProductUpdateArgs) => {
      console.log("🚀 ~ ProductResolver ~ updateProductStatus: ~ productId:", productId, status)
      if (!status) {
        throw new GraphQLError('Status is required');
      }
      return this.tryExecute(() => 
        this.productService.updateStatus(productId, status)
      );
    },

    updateProductCategory: async (_: any, { productId, category }: ProductUpdateArgs) => {
      if (!category) {
        throw new GraphQLError('Category is required');
      }
      return this.tryExecute(() => 
        this.productService.updateCategory(productId, category)
      );
    }
  };
}