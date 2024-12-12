import { GraphQLError } from 'graphql';
import { AuthService } from '../../services/AuthService';

export class AuthResolver {
  constructor(private authService: AuthService) {}

  Mutation = {
    register: async (_: any, { email, password }: { email: string; password: string }) => {
      try {
        return await this.authService.register(email, password);
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }
    },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      try {
        return await this.authService.login(email, password);
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
    }
  };
}