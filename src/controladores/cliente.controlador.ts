import { Request,  Response} from "express";
import { HttpRespuestaError } from '../utilidades/httpRespuestaError';
import * as yup from 'yup';
import * as sql from 'mssql';

import Conexion from '../db/conexion';
import { IParametro } from "../interfaces/db.interfaz";

export const listaClientes = async(req: Request, res: Response) => {
    try {
        const conexion = new Conexion();
        const resultado = await conexion.Ejecutar('sp_clientes_listar');
        return res.status(200).send(resultado);        
    } catch (error) {
        if (error instanceof HttpRespuestaError) {
            console.log(error.message)      
            return res.status(error.statusCode).send(error.message);       
        } 
    }
}

export const obtenerCliente = async(req: Request, res: Response) => {
    try {
        const conexion = new Conexion();
        const { id } = req.params;

        const parametros: IParametro[] = [
            {
                nombre: 'id_cliente',
                tipo: sql.VarChar,
                valor: id
            }
        ]

        const resultado = await conexion.Ejecutar('sp_cliente_obtener', parametros);
        
        if(resultado.length === 0){
            return res.status(404).send({mensage: "cliente no encontrado."});
        }

        return res.status(200).send(resultado[0]);
        
        
    } catch (error) {
        if (error instanceof HttpRespuestaError) {
            console.log(error.message)      
            return res.status(error.statusCode).send(error.message);       
        } 
    }
}

const crearClienteEsquema = yup.object({
    nombres: yup.string().required().max(100).min(3),
    apellidos: yup.string().required().max(100).min(3),
    identidad: yup.string().required().max(20).min(13),
    direccion: yup.string().required().max(100).min(2),
})

export const crearCliente = async(req: Request, res: Response) => {
    try {
        await crearClienteEsquema.validate(req.body);
    } catch (error) {
        if (error instanceof HttpRespuestaError) {               
            return res.status(400).send({mensage: error.message});       
        }            
    }

    const { nombres, apellidos, identidad, direccion } = req.body;

    try {
        const conexion = new Conexion();

        const parametros: IParametro[] = [
            {
                nombre: 'nombres',
                tipo: sql.VarChar,
                valor: nombres
            },
            {
                nombre: 'apellidos',
                tipo: sql.VarChar,
                valor: apellidos
            },
            {
                nombre: 'identidad',
                tipo: sql.VarChar,
                valor: identidad
            },
            {
                nombre: 'direccion',
                tipo: sql.VarChar,
                valor: direccion
            }
        ]

        const resultado = await conexion.Ejecutar('sp_cliente_crear', parametros);
        return res.status(201).send(resultado[0]);        
    } catch (error) {
        if (error instanceof HttpRespuestaError) {
            console.log(error.message)      
            return res.status(error.statusCode).send(error.message);       
        } 
    }
}

export const actualizarCliente = async(req: Request, res: Response) => {
    try {
        await crearClienteEsquema.validate(req.body);
    } catch (error) {
        if (error instanceof HttpRespuestaError) {               
            return res.status(400).send({mensage: error.message});       
        }            
    }

    const { nombres, apellidos, identidad } = req.body;
    const { id } = req.params;

    try {
        const conexion = new Conexion();

        const parametros: IParametro[] = [
            {
                nombre: 'id_cliente',
                tipo: sql.Int,
                valor: id
            },
            {
                nombre: 'nombres',
                tipo: sql.VarChar,
                valor: nombres
            },
            {
                nombre: 'apellidos',
                tipo: sql.VarChar,
                valor: apellidos
            },
            {
                nombre: 'identidad',
                tipo: sql.VarChar,
                valor: identidad
            }
        ]

        const resultado = await conexion.Ejecutar('sp_cliente_actualizar', parametros);
        return res.status(201).send(resultado[0]);        
    } catch (error) {
        if (error instanceof HttpRespuestaError) {
            console.log(error.message)      
            return res.status(error.statusCode).send(error.message);       
        } 
    }
}

export const eliminararCliente = async(req: Request, res: Response) => {
    
    const { id } = req.params;

    try {
        const conexion = new Conexion();

        const parametros: IParametro[] = [
            {
                nombre: 'id_cliente',
                tipo: sql.Int,
                valor: id
            }
        ]

        const resultado = await conexion.Ejecutar('sp_cliente_eliminar', parametros);
        return res.status(201).send(resultado[0]);        
    } catch (error) {
        if (error instanceof HttpRespuestaError) {
            console.log(error.message)      
            return res.status(error.statusCode).send(error.message);       
        } 
    }
}