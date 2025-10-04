const mysql = require('mysql2');
require('dotenv').config();

// Configuración de prueba
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'innovacel_db',
    port: process.env.DB_PORT || 3306
};

console.log('🔍 Probando conexión a MySQL...');
console.log('📋 Configuración:', {
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password ? '***' : '(vacía)',
    database: dbConfig.database,
    port: dbConfig.port
});

// Crear conexión de prueba
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión:', err.message);
        console.error('🔧 Posibles soluciones:');
        console.error('   1. Verificar que MySQL esté ejecutándose');
        console.error('   2. Verificar usuario y contraseña');
        console.error('   3. Verificar que el puerto 3306 esté disponible');
        console.error('   4. Crear el archivo .env con la configuración correcta');
        process.exit(1);
    }
    
    console.log('✅ Conexión exitosa a MySQL!');
    
    // Probar consulta básica
    connection.query('SELECT VERSION() as version', (err, results) => {
        if (err) {
            console.error('❌ Error en consulta:', err.message);
        } else {
            console.log('📊 Versión de MySQL:', results[0].version);
        }
        
        // Probar creación de base de datos
        connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`, (err) => {
            if (err) {
                console.error('❌ Error creando base de datos:', err.message);
            } else {
                console.log(`✅ Base de datos '${dbConfig.database}' verificada/creada`);
            }
            
            connection.end();
            console.log('🔚 Conexión cerrada');
        });
    });
});

