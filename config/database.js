const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la conexión a MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'innovacel_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Crear conexión promisificada
const promisePool = pool.promise();

// Función para probar la conexión
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con MySQL:', error.message);
        return false;
    }
};

// Función para inicializar la base de datos y crear tablas
const initializeDatabase = async () => {
    try {
        // Crear la base de datos si no existe (sin prepared statement)
        await promisePool.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        console.log(`✅ Base de datos '${dbConfig.database}' verificada/creada`);
        
        // Crear tabla de notas directamente en la base de datos especificada
        const createNotesTable = `
            CREATE TABLE IF NOT EXISTS ${dbConfig.database}.notas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                contenido TEXT NOT NULL,
                cliente VARCHAR(255),
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                estado ENUM('activa', 'archivada', 'eliminada') DEFAULT 'activa',
                INDEX idx_cliente (cliente),
                INDEX idx_fecha_creacion (fecha_creacion),
                INDEX idx_estado (estado)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `;
        
        await promisePool.query(createNotesTable);
        console.log('✅ Tabla de notas creada/verificada');
        
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error.message);
        return false;
    }
};

module.exports = {
    pool,
    promisePool,
    testConnection,
    initializeDatabase
};
