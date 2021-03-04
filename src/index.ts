import "reflect-metadata";
import express from 'express';
import { connectDB } from "./database/connection";
import { buildSchema, Query, Resolver } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { RegisterResolver } from "./modules/user/Register";

const app = express();

const port: Number = Number(process.env.PORT) || 5000;
const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [RegisterResolver]
  });

  const apolloServer = new ApolloServer({ schema });

  apolloServer.applyMiddleware({ app });

  await app.listen(port, () => {
    console.log(`[Server] running on http://localhost:${port}`);
  });
}

connectDB();
startServer();

app.get('/', (req, res) => {
  res.send('Hello World');
})

