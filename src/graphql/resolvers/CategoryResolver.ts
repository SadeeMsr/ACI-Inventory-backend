import { BaseResolver } from './BaseResolver';
import { CategoryService } from '../../services/CategoryService';
import { ProductService } from '../../services/ProductService';
import { GraphQLError } from 'graphql';

interface CreateCategoryArgs {
  name: string;
}

interface DeleteCategoryArgs {
  id: string;
}

export class CategoryResolver extends BaseResolver {
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    super();
  }

  Query = {
    categories: async () => {
      return this.tryExecute(() => this.categoryService.findAll());
    },

    analytics: async () => {
      return this.tryExecute(() => this.categoryService.getAnalytics());
    }
  };

  Mutation = {
    createCategory: async (_: any, { name }: CreateCategoryArgs) => {
      if (!name || name.trim().length === 0) {
        throw new GraphQLError('Category name is required', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      return this.tryExecute(() => this.categoryService.createCategory(name.trim()));
    },

    deleteCategory: async (_: any, { id }: DeleteCategoryArgs) => {
      return this.tryExecute(async () => {
        const category = await this.categoryService.findById(id);
        if (!category) {
          throw new GraphQLError('Category not found');
        }

        // Update all products in this category to Uncategorized
        await this.productService.updateManyByStatus(category.name, 'Uncategorized');
        
        return this.categoryService.delete(id);
      });
    }
  }
}