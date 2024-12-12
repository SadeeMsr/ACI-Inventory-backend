import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { GraphQLError } from 'graphql';

export class AuthService {
  async register(email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new GraphQLError('User already exists', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }

    const user = await User.create({
      email,
      password,
      role: 'user'
    });

    const token = this.generateToken(user);
    return { token, user };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email }) as IUser;
    if (!user || !(await user.matchPassword(password))) {
      throw new GraphQLError('Invalid credentials', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }

    const token = this.generateToken(user);
    return { token, user };
  }

  private generateToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );
  }
} 