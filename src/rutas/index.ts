import express from 'express';
import clienteRoute from './clientes.routes'

const app = express();

app.use('/v1/cliente',clienteRoute);
//app.use('/v1/productos',productosRoute);


export default app;