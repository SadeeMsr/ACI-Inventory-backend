import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';


export const authenticate = async (token?: string) => {
  if (!token) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }

    return user;
  } catch (error) {
    throw new GraphQLError('Invalid token', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
}; 