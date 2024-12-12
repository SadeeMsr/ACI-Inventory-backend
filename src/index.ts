import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { connectDB } from './config/db';
import { authenticate } from './middleware/auth';
import morgan from 'morgan';

dotenv.config();

const app = express();
const httpServer = createServer(app);

async function startServer() {
  await connectDB();

  app.use(morgan('dev')); 

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-client-domain.vercel.app']
        : ['http://localhost:3000'],
      credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(' ')[1];
        try {
          if (token) {
            const user = await authenticate(token);
            return { user };
          }
          return {};
        } catch (error) {
          return {};
        }
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startServer().catch((err) => console.error('Failed to start server:', err)); 