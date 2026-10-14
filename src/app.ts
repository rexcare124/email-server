import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/index.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/index.js';

const app: Express = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(morgan(config.isProduction ? 'combined' : 'dev'));
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Email server is running' });
});
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
