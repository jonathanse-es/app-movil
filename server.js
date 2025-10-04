const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
// Importar configuración de base de datos y modelo
const { testConnection, initializeDatabase } = require('./config/database');
const Nota = require('./models/Nota');
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notas.html'));
});

app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contacto.html'));
});

app.get('/acerca', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'acerca.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'InnovacelApp is running!',
        timestamp: new Date().toISOString()
    });
});

// API para notas de clientes


app.get('/api/notes', async (req, res) => {
    try {
        const filtros = {
            cliente: req.query.cliente,
            titulo: req.query.titulo,
            limit: req.query.limit
        };
        
        const resultado = await Nota.obtenerTodas(filtros);
        
        if (resultado.success) {
            res.json({
                success: true,
                message: 'Notas obtenidas exitosamente',
                data: resultado.notas,
                total: resultado.total
            });
        } else {
            res.status(500).json({
                success: false,
                message: resultado.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor: ' + error.message
        });
    }
});

app.get('/api/notes/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resultado = await Nota.obtenerPorId(id);
        
        if (resultado.success) {
            res.json({
                success: true,
                message: 'Nota obtenida exitosamente',
                data: resultado.nota
            });
        } else {
            res.status(404).json({
                success: false,
                message: resultado.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor: ' + error.message
        });
    }
});
/*
app.get('/api/notes/qr/:urlQR', async (req, res) => {
    try {
        console.log("a");
        const urlQR = parseInt(req.params.urlQR);
        console.log("b");
        const resultado = await Nota.generarQR(urlQR);
        console.log("c");
        if (resultado.success) {
            res.json({
                success: true,
                message: 'Nota obtenida exitosamente',
                data: resultado.qr
            });
        } else {
            res.status(404).json({
                success: false,
                message: resultado.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor: ' + error.message
        });
    }
});*/

app.get('/api/notes/qr/:folio', async (req, res) => {
    try {
        const folio = parseInt(req.params.folio);
        const resultado = await Nota.generarQR(folio);
        
        if (resultado.success) {
            res.json({
                success: true,
                message: 'QR Generado',
                data: resultado.qr
            });
        } else {
            res.status(404).json({
                success: false,
                message: resultado.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor: ' + error.message
        });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const { titulo, contenido, cliente, clientPhone, noteType } = req.body;
        
        // Validar datos requeridos
        if (!titulo || !contenido) {
            return res.status(400).json({
                success: false,
                message: 'Título y contenido son requeridos'
            });
        }
        
        const notaData = {
            titulo: titulo.trim(),
            contenido: contenido.trim(),
            cliente: cliente ? cliente.trim() : '',
            clientPhone: clientPhone.trim(),
            noteType:noteType.trim()
        };
        
        const resultado = await Nota.crear(notaData);
        
        if (resultado.success) {
            res.status(201).json({
                success: true,
                message: resultado.message,
                data: { id: resultado.id, ...notaData }
            });
        } else {
            res.status(500).json({
                success: false,
                message: resultado.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor: ' + error.message
        });
    }
});

app.put('/api/notes/:id', async (req, res) => {
    try {

        const id = parseInt(req.params.id);
        const { titulo, contenido, cliente, estado, clientPhone, noteType } = req.body;
        
        // Validar datos requeridos
        if (!titulo || !contenido) {
            return res.status(400).json({
                success: false,
                message: 'Título y contenido son requeridos'
            });
        }
        
        const notaData = {
            titulo: titulo.trim(),
            contenido: contenido.trim(),
            cliente: cliente ? cliente.trim() : '',
            estado: estado || 'activa',
            clientPhone: clientPhone.trim(),
            noteType:noteType.trim()
        };

        const resultado = await Nota.actualizar(id, notaData);
        if (resultado.success) {
            res.json({
                success: true,
                message: resultado.message,
                data: { id, ...notaData }
            });
        } else {
            res.status(404).json({
                success: false,
                message: resultado.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor: ' + error.message
        });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resultado = await Nota.eliminar(id);
        
        if (resultado.success) {
            res.json({
                success: true,
                message: resultado.message
            });
        } else {
            res.status(404).json({
                success: false,
                message: resultado.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor: ' + error.message
        });
    }
});

app.patch('/api/notes/:id/archive', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resultado = await Nota.archivar(id);
        
        if (resultado.success) {
            res.json({
                success: true,
                message: resultado.message
            });
        } else {
            res.status(404).json({
                success: false,
                message: resultado.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor: ' + error.message
        });
    }
});

app.get('/api/notes/stats', async (req, res) => {
    try {
        const resultado = await Nota.obtenerEstadisticas();
        
        if (resultado.success) {
            res.json({
                success: true,
                message: 'Estadísticas obtenidas exitosamente',
                data: resultado.estadisticas
            });
        } else {
            res.status(500).json({
                success: false,
                message: resultado.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor: ' + error.message
        });
    }
});

// Inicializar base de datos y iniciar servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos
        const dbConnected = await testConnection();
        
        if (dbConnected) {
            // Inicializar base de datos y crear tablas
            const dbInitialized = await initializeDatabase();
            
            if (dbInitialized) {
                console.log('✅ Base de datos inicializada correctamente');
            } else {
                console.log('⚠️  Advertencia: No se pudo inicializar completamente la base de datos');
            }
        } else {
            console.log('⚠️  Advertencia: No se pudo conectar a la base de datos');
            console.log('💡 Asegúrate de que MySQL esté ejecutándose y las credenciales sean correctas');
        }
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 InnovacelApp server running on port ${PORT}`);
            console.log(`📱 Visit: http://localhost:${PORT}`);
            console.log(`📊 API endpoints:`);
            console.log(`   GET    /api/notes          - Obtener todas las notas`);
            console.log(`   GET    /api/notes/:id       - Obtener nota por ID`);
            console.log(`   GET    /api/notes/:id       - Obtener nota por ID`);
            console.log(`   POST   /api/notes           - Crear nueva nota`);
            console.log(`   PUT    /api/notes/:id       - Actualizar nota`);
            console.log(`   DELETE /api/notes/:id       - Eliminar nota`);
            console.log(`   PATCH  /api/notes/:id/archive - Archivar nota`);
            console.log(`   GET    /api/notes/stats     - Obtener estadísticas`);
        });
        
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

// Iniciar la aplicación
startServer();
