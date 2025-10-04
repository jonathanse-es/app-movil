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

console.log('🔍 Validando almacenamiento de datos en la base de datos...');

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Conectado a MySQL');
    
    // Verificar estructura de la tabla
    connection.query('DESCRIBE innovacel_db.notas', (err, results) => {
        if (err) {
            console.error('❌ Error describiendo tabla:', err.message);
        } else {
            console.log('📋 Estructura de la tabla notas:');
            results.forEach(row => {
                console.log(`   ${row.Field}: ${row.Type} ${row.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
            });
        }
        
        // Obtener todas las notas para validar datos
        connection.query('SELECT * FROM innovacel_db.notas ORDER BY fecha_creacion DESC LIMIT 5', (err, notes) => {
            if (err) {
                console.error('❌ Error obteniendo notas:', err.message);
            } else {
                console.log('\n📝 Últimas 5 notas almacenadas:');
                notes.forEach((note, index) => {
                    console.log(`\n${index + 1}. ID: ${note.id}`);
                    console.log(`   Título: ${note.titulo}`);
                    console.log(`   Cliente: ${note.cliente || 'Sin cliente'}`);
                    console.log(`   Teléfono: ${note.clientPhone || 'Sin teléfono'}`);
                    console.log(`   Contenido: ${note.contenido.substring(0, 50)}${note.contenido.length > 50 ? '...' : ''}`);
                    console.log(`   Estado: ${note.estado}`);
                    console.log(`   Fecha: ${note.fecha_creacion}`);
                });
                
                // Estadísticas
                connection.query(`
                    SELECT 
                        COUNT(*) as total_notas,
                        COUNT(CASE WHEN clientPhone IS NOT NULL AND clientPhone != '' THEN 1 END) as notas_con_telefono,
                        COUNT(CASE WHEN cliente IS NOT NULL AND cliente != '' THEN 1 END) as notas_con_cliente
                    FROM innovacel_db.notas 
                    WHERE estado = 'activa'
                `, (err, stats) => {
                    if (err) {
                        console.error('❌ Error obteniendo estadísticas:', err.message);
                    } else {
                        const stat = stats[0];
                        console.log('\n📊 Estadísticas:');
                        console.log(`   Total de notas activas: ${stat.total_notas}`);
                        console.log(`   Notas con teléfono: ${stat.notas_con_telefono}`);
                        console.log(`   Notas con cliente: ${stat.notas_con_cliente}`);
                        console.log(`   Porcentaje con teléfono: ${((stat.notas_con_telefono / stat.total_notas) * 100).toFixed(1)}%`);
                    }
                    
                    connection.end();
                    console.log('\n🎉 Validación completada!');
                });
            }
        });
    });
});




