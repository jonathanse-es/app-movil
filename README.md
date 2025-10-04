# InnovacelApp - Sistema de Gestión de Notas

Una aplicación web moderna para gestionar notas de clientes con base de datos MySQL.

## 🚀 Características

- ✅ Gestión completa de notas (CRUD)
- ✅ Base de datos MySQL integrada
- ✅ API REST completa
- ✅ Sistema de estados (activa, archivada, eliminada)
- ✅ Filtros y búsquedas
- ✅ Estadísticas de notas
- ✅ Interfaz web moderna

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- MySQL (versión 5.7 o superior)
- npm o yarn

## 🛠️ Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
npm install
```

### 2. Configurar la base de datos MySQL

1. **Instalar MySQL** (si no lo tienes instalado)
2. **Crear un usuario y base de datos** (opcional, la app creará la DB automáticamente):

```sql
CREATE DATABASE innovacel_db;
CREATE USER 'innovacel_user'@'localhost' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON innovacel_db.* TO 'innovacel_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configurar variables de entorno

1. Copia el archivo de ejemplo:
```bash
cp env.example .env
```

2. Edita el archivo `.env` con tus credenciales de MySQL:
```env
# Configuración del servidor
PORT=3000

# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=innovacel_db
DB_PORT=3306

# Configuración adicional
NODE_ENV=development
```

### 4. Iniciar la aplicación

```bash
npm start
```

La aplicación estará disponible en: http://localhost:3000

## 📊 API Endpoints

### Notas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/notes` | Obtener todas las notas |
| GET | `/api/notes/:id` | Obtener nota por ID |
| POST | `/api/notes` | Crear nueva nota |
| PUT | `/api/notes/:id` | Actualizar nota |
| DELETE | `/api/notes/:id` | Eliminar nota |
| PATCH | `/api/notes/:id/archive` | Archivar nota |
| GET | `/api/notes/stats` | Obtener estadísticas |

### Ejemplos de uso

#### Crear una nota
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Reunión con cliente",
    "contenido": "Seguimiento de proyecto importante",
    "cliente": "Empresa ABC"
  }'
```

#### Obtener todas las notas
```bash
curl http://localhost:3000/api/notes
```

#### Obtener notas filtradas
```bash
curl "http://localhost:3000/api/notes?cliente=ABC&limit=10"
```

## 🗄️ Estructura de la Base de Datos

### Tabla: notas

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único (auto-increment) |
| titulo | VARCHAR(255) | Título de la nota |
| contenido | TEXT | Contenido de la nota |
| cliente | VARCHAR(255) | Nombre del cliente |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| fecha_modificacion | TIMESTAMP | Fecha de última modificación |
| estado | ENUM | Estado: 'activa', 'archivada', 'eliminada' |

## 🔧 Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en modo desarrollo (con nodemon)
- `npm run build` - Construir CSS (Tailwind)

## 🐛 Solución de Problemas

### Error de conexión a MySQL
1. Verifica que MySQL esté ejecutándose
2. Confirma las credenciales en el archivo `.env`
3. Asegúrate de que el usuario tenga permisos en la base de datos

### Puerto en uso
Si el puerto 3000 está ocupado, cambia el valor de `PORT` en el archivo `.env`

## 📝 Notas de Desarrollo

- La aplicación usa un pool de conexiones para optimizar el rendimiento
- Implementa soft delete (las notas se marcan como eliminadas, no se borran físicamente)
- Incluye validación de datos en todas las rutas API
- Manejo de errores robusto con mensajes informativos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

