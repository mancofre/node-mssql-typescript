import * as sql from 'mssql';
import { CONFIG } from '../config';
import { IParametro } from '../interfaces/db.interfaz';
import { HttpRespuestaError } from '../utilidades/httpRespuestaError';

class Conexion{
    public config: sql.config;

    constructor(){
        this.config = {
            user: CONFIG.DB_USER,
            password: CONFIG.DB_PASSWORD,
            database: CONFIG.DB_DATABASE,
            server: CONFIG.DB_HOST,
            pool:{
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            },
            options:{
                encrypt: false,
                trustServerCertificate: false
            }
        }
    }

    async Ejecutar(procedimiento: string, parametros: IParametro[] = []): Promise<any> {
        return new Promise(async (resolve, reject) =>{

            let pool!: sql.ConnectionPool;
            try {
                pool = await new sql.ConnectionPool(this.config).connect();
    
            } catch (e) {
                console.log('ERROR AL EJECUTAR EL SP', '');
                reject(new HttpRespuestaError('No se pudo conectar a la BD', 500));
                return;
            }

            try {
                const consulta = pool.request();
                parametros.forEach(function (elemento){
                    consulta.input(elemento.nombre, elemento.tipo, elemento.valor)
                });

                const { returnValue, recordset } = await consulta.execute(procedimiento);                
                switch (returnValue){
                    case 0:
                        console.log('ERROR NO CONTROLADO AL EJECUTAR SP', recordset[0]);
                        reject(new HttpRespuestaError(recordset[0].mesage || 'No se pudo ejecutar la consulta', 400));
                        break;
                    case 1:
                        resolve(recordset);
                        break;
                    case -1:
                        console.log('ERROR NO CONTROLADO AL EJECUTAR SP', recordset[0]);
                        reject(new HttpRespuestaError('No se pudo ejecutar la consulta, error no esperado'));
                        break;
                    default:
                        console.log('returnValue SP no esperado', recordset[0]);
                        reject(new HttpRespuestaError('Respuesta no esperada', 500));
                        break;
                }
                
            } catch (error) {
                if (error instanceof HttpRespuestaError) {
                    console.log(`ERROR AL EJECUTAR EL SP COD (${error.statusCode}): ${error.message}`);
                    reject(new HttpRespuestaError(error.message, error.statusCode));
                  } else if (error instanceof Error) {
                    console.log(error.message);
                  }
            } finally {
                if(pool && typeof pool.close === 'function'){
                    pool.close();
                }
            }
        });
    }
}

export default Conexion;