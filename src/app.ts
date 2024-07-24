import express, { Request, Response } from 'express';
import { CONFIG } from './config';
import routes from './rutas/index';

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
  });

app.listen(CONFIG.APP_PORT, () => {
  console.log(`Server corriendo en http://localhost:${CONFIG.APP_PORT}`);
}); 