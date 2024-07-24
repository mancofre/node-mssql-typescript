import path from 'path';
import * as dotenv from 'dotenv';

const envPath = path.join(__dirname, '..', `.env`);


if(envPath){
    dotenv.config({ path: envPath});
}
else{
    dotenv.config();
}

const validarVariablesEntorno = (nombre: string) => {    
    const valor = process.env[nombre];
    if(!valor){       
        console.log(nombre)
        console.log(process.env.APP_PORT)
        throw new Error(`La variable de entorno ${nombre} es requerida`);
    }
    return valor;
}

export const CONFIG = {
    APP_PORT: validarVariablesEntorno('APP_PORT') || process.env.APP_PORT,
    DB_HOST: validarVariablesEntorno('DB_HOST'),
    DB_USER: validarVariablesEntorno('DB_USER'),
    DB_PASSWORD: validarVariablesEntorno('DB_PASSWORD'),
    DB_DATABASE: validarVariablesEntorno('DB_DATABASE'),
    DB_PORT: validarVariablesEntorno('DB_PORT')
};