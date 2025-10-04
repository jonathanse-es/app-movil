const { promisePool } = require('../config/database');
const express = require('express');
const QRCode = require('qrcode');

class Nota {
 
    constructor(data) {
        this.id = data.id || null;
        this.titulo = data.titulo || '';
        this.contenido = data.contenido || '';
        this.cliente = data.cliente || '';
        this.fecha_creacion = data.fecha_creacion || null;
        this.fecha_modificacion = data.fecha_modificacion || null;
        this.estado = data.estado || 'activa';
        this.clientPhone = data.clientPhone || '';
        this.noteType = data.noteType || 'consulta';
    }

    // Crear una nueva nota
    static async crear(notaData) {
     
        try {
            const sql = `
                INSERT INTO innovacel_db.notas (titulo, contenido, cliente, estado, clientPhone, noteType) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
   
            const [result] = await promisePool.execute(sql, [
                notaData.titulo,
                notaData.contenido,
                notaData.cliente,
                notaData.estado || 'activa',
                notaData.clientPhone  || '',
                notaData.noteType || 'consulta'
            ]);
            
            return {
                success: true,
                id: result.insertId,
                message: 'Nota creada exitosamente'
            };
        } catch (error) {
            console.error('Error al crear nota:', error);
            return {
                success: false,
                message: 'Error al crear la nota: ' + error.message
            };
        }
    }

    // Obtener todas las notas activas
    static async obtenerTodas(filtros = {}) {
        try {
            let sql = 'SELECT * FROM innovacel_db.notas WHERE estado = ?';
            const params = ['activa'];

            // Aplicar filtros
            if (filtros.cliente) {
                sql += ' AND cliente LIKE ?';
                params.push(`%${filtros.cliente}%`);
            }

            if (filtros.titulo) {
                sql += ' AND titulo LIKE ?';
                params.push(`%${filtros.titulo}%`);
            }

            sql += ' ORDER BY fecha_creacion DESC';

            // Aplicar límite si se especifica
            if (filtros.limit) {
                sql += ' LIMIT ?';
                params.push(parseInt(filtros.limit));
            }

            const [rows] = await promisePool.execute(sql, params);
            
            return {
                success: true,
                notas: rows,
                total: rows.length
            };
        } catch (error) {
            console.error('Error al obtener notas:', error);
            return {
                success: false,
                message: 'Error al obtener las notas: ' + error.message
            };
        }
    }

    // Obtener una nota por ID
    static async obtenerPorId(id) {
        try {
            const sql = 'SELECT * FROM innovacel_db.notas WHERE id = ? AND estado = ?';
            const [rows] = await promisePool.execute(sql, [id, 'activa']);
            
            if (rows.length === 0) {
                return {
                    success: false,
                    message: 'Nota no encontrada'
                };
            }

            return {
                success: true,
                nota: rows[0]
            };
        } catch (error) {
            console.error('Error al obtener nota por ID:', error);
            return {
                success: false,
                message: 'Error al obtener la nota: ' + error.message
            };
        }
    }

    // Actualizar una nota
    static async actualizar(id, notaData) {

        try {
            const sql = `
                UPDATE innovacel_db.notas 
                SET titulo = ?, contenido = ?, cliente = ?, estado = ?, clientPhone = ?, noteType = ?
                WHERE id = ? AND estado = ?
            `;
            const [result] = await promisePool.execute(sql, [
                notaData.titulo,
                notaData.contenido,
                notaData.cliente,
                notaData.estado || 'activa',
                notaData.clientPhone,
                notaData.noteType || 'consulta',
                id,
                'activa'
            ]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: 'Nota no encontrada o ya eliminada'
                };
            }

            return {
                success: true,
                message: 'Nota actualizada exitosamente'
            };
        } catch (error) {
            console.error('Error al actualizar nota:', error);
            return {
                success: false,
                message: 'Error al actualizar la nota: ' + error.message
            };
        }
    }


 
      

    // Eliminar una nota (soft delete)
    static async eliminar(id) {
        try {
            const sql = 'UPDATE innovacel_db.notas SET estado = ? WHERE id = ? AND estado = ?';
            const [result] = await promisePool.execute(sql, ['eliminada', id, 'activa']);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: 'Nota no encontrada o ya eliminada'
                };
            }

            return {
                success: true,
                message: 'Nota eliminada exitosamente'
            };
        } catch (error) {
            console.error('Error al eliminar nota:', error);
            return {
                success: false,
                message: 'Error al eliminar la nota: ' + error.message
            };
        }
    }

    // Archivar una nota
    static async archivar(id) {
        try {
            const sql = 'UPDATE innovacel_db.notas SET estado = ? WHERE id = ? AND estado = ?';
            const [result] = await promisePool.execute(sql, ['archivada', id, 'activa']);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: 'Nota no encontrada o ya archivada'
                };
            }

            return {
                success: true,
                message: 'Nota archivada exitosamente'
            };
        } catch (error) {
            console.error('Error al archivar nota:', error);
            return {
                success: false,
                message: 'Error al archivar la nota: ' + error.message
            };
        }
    }

    // Obtener estadísticas de notas
    static async obtenerEstadisticas() {
        try {
            const sql = `
                SELECT 
                    estado,
                    COUNT(*) as total,
                    COUNT(CASE WHEN DATE(fecha_creacion) = CURDATE() THEN 1 END) as hoy
                FROM innovacel_db.notas 
                GROUP BY estado
            `;
            const [rows] = await promisePool.execute(sql);
            
            return {
                success: true,
                estadisticas: rows
            };
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return {
                success: false,
                message: 'Error al obtener estadísticas: ' + error.message
            };
        }
    }
    static async generarQR(folio) {
        try {
            console.log("folio:" + folio);
            const text =  'http://localhost:3000/notas?folio='+folio;

            console.log("text:" + text);
            // Generar el QR como imagen en base64
            const qrImage = await QRCode.toDataURL(text);
            console.log("generarQR");
            return {
                success: true,
                qr: qrImage
            };
            // Devolverlo como HTML <img> o solo JSON
           // res.json({ qr: qrImage });
          } catch (error) {
         //   res.status(500).send('Error generando QR');
            return {
                success: false,
                message: 'Error generando QR: ' + error.message
            };
          }
    }

}


module.exports = Nota;
