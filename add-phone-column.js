const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'innovacel_db',
    port: process.env.DB_PORT || 3306
};

console.log('🔧 Agregando columna clientPhone a la tabla notas...');

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Conectado a MySQL');
    
    // Agregar columna clientPhone si no existe
    const addColumnSQL = `
        ALTER TABLE innovacel_db.notas 
        ADD COLUMN clientPhone VARCHAR(20) DEFAULT NULL
    `;
    
    connection.query(addColumnSQL, (err) => {
        if (err) {
            console.error('❌ Error agregando columna:', err.message);
        } else {
            console.log('✅ Columna clientPhone agregada exitosamente');
            
            // Verificar la estructura de la tabla
            connection.query('DESCRIBE innovacel_db.notas', (err, results) => {
                if (err) {
                    console.error('❌ Error describiendo tabla:', err.message);
                } else {
                    console.log('📋 Estructura actual de la tabla:');
                    results.forEach(row => {
                        console.log(`   ${row.Field}: ${row.Type} ${row.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
                    });
                }
                
                connection.end();
                console.log('🎉 Actualización completada!');
            });
        }
    });
});
