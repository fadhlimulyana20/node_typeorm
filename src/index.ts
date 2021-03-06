import "reflect-metadata";
import express from 'express';
import { connectDB } from "./database/connection";
import { buildSchema, Query, Resolver } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { RegisterResolver } from "./modules/user/Register";
import session from "express-session";
import connectRedis from 'connect-redis';
import cors from 'cors';
import { redis } from "./redis";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";
import { authChecker } from "./modules/auth/authChecker";

// implement Declaration merging on express-session:
declare module 'express-session' {
  export interface SessionData {
    userId: number;
  }
}

const app = express();


// Create port number
const port: Number = Number(process.env.PORT) || 5000;

// A Function to start server
const startServer = async () => {
  // Create GraphQl
  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver],
    authChecker
  });
  
  //Create apolloServer for graphQl
  const apolloServer = new ApolloServer({ 
    schema,
    context: ({ req } : any) => ({ req }) 
  });
  
  // Add cors middleware
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }));

  // Connect to redis
  const RedisStore = connectRedis(session);

  // Add session middleware
  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );
  
  // Add apollo server middleware
  apolloServer.applyMiddleware({ app });

  await app.listen(port, () => {
    console.log(`[Server] running on http://localhost:${port}`);
  });
}

connectDB(); //Connect DB
startServer(); //Start te server

app.get('/', (req, res) => {
  res.send('Hello World');
})

