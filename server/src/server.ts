import express, { Express, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import dotenv from 'dotenv';
import schema from './schemas';
import { resolvers } from './resolvers';
import { connectDB } from './config/db';

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.get('/', (_req: Request, res: Response) => {
  res.send('Weather App Backend');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));