import { DataSourceOptions, DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ override: true });

const dataSource = new DataSource(dataSourceOption());
console.log('DB_HOST', process.env.DB_HOST);
console.log('DB_USER', process.env.DB_USER);

export function dataSourceOption(): DataSourceOptions {
	return {
		
		type: 'postgres',
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT),
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		entities: [path.join(__dirname, '../src/**/*.entity.{js,ts}') ],
		migrations: [path.join(__dirname, '../db/migrations/*.{js,ts}')],
		logging: process.env.PRODUCTION == 'false',
		cache: false
	};
}


const dataSource_SG = new DataSource(dataSourceOptionSagarhpa());
console.log('DB_HOST', process.env.DB_HOST_SG_P);
console.log('DB_USER', process.env.DB_USER_SG_P);
export function dataSourceOptionSagarhpa(): DataSourceOptions {
	return {
		name: 'marcas',
		type: 'mysql',
		host: process.env.DB_HOST_SG,
		port: parseInt(process.env.DB_PORT_SG),
		username: process.env.DB_USER_SG,
		password: process.env.DB_PASSWORD_SG,
		database: process.env.DB_DATABASE_SG,
		logging: process.env.PRODUCTION == 'false',
		cache: false
	};
}
const dataSource_sagarhpa = new DataSource(dataSourceOptionSG());

console.log('DB_HOST_SAGARHPA', process.env.DB_HOST_SG_P);
console.log('DB_USER_SAGARHPA', process.env.DB_USER_SG_P);
export function dataSourceOptionSG(): DataSourceOptions {
    return {
        name: 'sagarhpa', // Nombre único para esta conexión
        type: 'postgres',
        host: process.env.DB_HOST_SG_P,
        port: parseInt(process.env.DB_PORT_SG_P),
        username: process.env.DB_USER_SG_P,
        password: process.env.DB_PASSWORD_SG_P,
        database: process.env.DB_DATABASE_SG_P,
        entities: [path.join(__dirname, '../src/**/*.entity.{js,ts}')],
        logging: process.env.PRODUCTION == 'false',
        cache: false
    };
}

export default dataSource;

