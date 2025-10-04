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

console.log('🔧 Inicializando base de datos...');

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Conectado a MySQL');
    
    // Crear tabla de notas
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS notas (
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
    
    connection.query(createTableSQL, (err) => {
        if (err) {
            console.error('❌ Error creando tabla:', err.message);
        } else {
            console.log('✅ Tabla "notas" creada/verificada exitosamente');
            
            // Insertar datos de prueba
            const insertTestData = `
                INSERT INTO notas (titulo, contenido, cliente) VALUES 
                ('Nota de Prueba 1', 'Esta es una nota de prueba para verificar el sistema', 'Cliente Demo'),
                ('Reunión Importante', 'Seguimiento de proyecto crítico con el cliente', 'Empresa ABC'),
                ('Recordatorio', 'Llamar al cliente para confirmar cita', 'Cliente VIP')
            `;
            
            connection.query(insertTestData, (err) => {
                if (err) {
                    console.log('ℹ️  Los datos de prueba ya existen o hubo un error:', err.message);
                } else {
                    console.log('✅ Datos de prueba insertados');
                }
                
                connection.end();
                console.log('🎉 Inicialización completada!');
            });
        }
    });
});




