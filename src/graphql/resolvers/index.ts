import { ProductService } from '../../services/ProductService';
import { CategoryService } from '../../services/CategoryService';
import { ProductResolver } from './ProductResolver';
import { CategoryResolver } from './CategoryResolver';
import { AuthService } from '../../services/AuthService';
import { AuthResolver } from './AuthResolver';

const productService = new ProductService();
const categoryService = new CategoryService();
const authService = new AuthService();

const productResolver = new ProductResolver(productService);
const categoryResolver = new CategoryResolver(categoryService, productService);
const authResolver = new AuthResolver(authService);

export const resolvers = {
  Query: {
    ...productResolver.Query,
    ...categoryResolver.Query
  },
  Mutation: {
    ...productResolver.Mutation,
    ...categoryResolver.Mutation,
    ...authResolver.Mutation
  }
}; 