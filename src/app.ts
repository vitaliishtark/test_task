import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { MongoClient } from 'mongodb';
import generateCustomers from './customerGenerator';
import { typeDefs } from './schema';
import resolvers from './resolver';
import 'dotenv/config';
import { listenToCustomerChanges } from './eventListener';

async function startServer() {
  const app = express();

  console.log('Connecting to database...', process.env.DB_URI);

  const client = await MongoClient.connect(process.env.DB_URI);
  const db = client.db('test');

  console.log('Generating customers...');
  generateCustomers(db);
  listenToCustomerChanges(db);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { db },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 3000 }, () => {
    console.log(`Server ready at http://localhost:3000${server.graphqlPath}`);
  });
}

startServer();
