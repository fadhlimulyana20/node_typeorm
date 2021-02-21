import * as express from 'express';
import { Server } from 'http';
import { start } from 'repl';
import { connectDB } from "./database/connection";

const app = express();

const port: Number = Number(process.env.PORT) || 3000;
const startServer = async () => {
  await app.listen(port, () => {
    console.log(`[Server] running on http://localhost:${port}`);
  });
}

connectDB();
startServer();

app.get('/', (req, res) => {
  res.send('Hello World');
})

