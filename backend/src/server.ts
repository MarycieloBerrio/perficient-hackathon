import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRouter from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'mars-infrastructure-server' });
});

app.use('/api', apiRouter);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('[ERROR]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
