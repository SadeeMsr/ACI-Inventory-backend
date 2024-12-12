import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Product {
    id: ID!
    material: Int!
    barcode: String!
    description: String!
    quantity: Int!
    category: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    productCount: Int!
  }

  type Query {
    products(category: String, status: String): [Product!]!
    product(id: ID!): Product
    productByBarcode(barcode: String!): ProductResponse!
    categories: [Category!]!
    analytics: Analytics!
  }

  type Mutation {
    addProduct(barcode: String!): ProductResponse!
    updateProductStatus(productId: ID!, status: String!): Product!
    updateProductCategory(productId: ID!, category: String!): Product!
    createCategory(name: String!): Category!
    register(email: String!, password: String!): AuthResponse!
    login(email: String!, password: String!): AuthResponse!
    deleteCategory(id: ID!): Category!
  }

  type ProductResponse {
    status: Boolean!
    product: Product
    error: String
  }

  type Analytics {
    productsByCategory: [CategoryCount!]!
    recentProducts: [Product!]!
    totalProducts: Int!
    totalCategories: Int!
  }

  type CategoryCount {
    category: String!
    count: Int!
  }

  type User {
    id: ID!
    email: String!
    role: String!
  }

  type AuthResponse {
    token: String!
    user: User!
  }
`; 