import { Router } from "express";
import { listaClientes, obtenerCliente, crearCliente, actualizarCliente, eliminararCliente } from '../controladores/cliente.controlador';


const route = Router();

route.get('/', listaClientes);
route.get('/:id', obtenerCliente);
route.post('/', crearCliente);
route.put('/:id', actualizarCliente);
route.delete('/:id', eliminararCliente);

export default route;