# Zeiko Inventory Dashboard

## Descripción
Sistema de gestión de inventario y productos diseñado para empresas, con funcionalidades avanzadas de recomendación de productos y análisis de tendencias.

## Origen del Proyecto
Este proyecto nace de la necesidad real de un grupo de emprendedores de e-commerce que operan bajo el modelo de dropshipping. Frente a los desafíos de gestionar múltiples proveedores, productos y pedidos, identificamos la necesidad de una solución integral que permitiera:

- Centralizar la gestión de proveedores y productos
- Automatizar el seguimiento de inventario
- Facilitar la toma de decisiones basada en datos
- Optimizar la selección de productos mediante IA

La plataforma está diseñada específicamente para emprendedores de dropshipping, ofreciendo herramientas especializadas para:
- Gestionar relaciones con proveedores
- Analizar tendencias de productos
- Optimizar la selección de productos
- Mantener un control eficiente del inventario virtual

## Tecnologías principales

- **Backend:** Django + Django REST Framework + PostgreSQL
- **Frontend:** React 18 + Vite + MUI 5 + Emotion 11 + React Router 6
- **Autenticación:** JWT
- **Diseño:** Atomic Design, dark mode, responsive
- **Recomendación IA:** Integración con OpenAI ChatGPT (API)

## Características principales

### Gestión de Usuarios y Empresas
- Sistema de autenticación JWT
- Roles: admin y external
- Gestión de perfiles de usuario
- Administración de empresas y sus detalles

### Gestión de Inventario
- CRUD completo para productos e inventario
- Categorización de productos
- Control de stock y alertas
- Historial de movimientos

### Análisis y Reportes
- Dashboard con métricas clave
- Gráficos de tendencias
- Reportes exportables
- Análisis de productos más vendidos

### Recomendación IA
- Sugerencias personalizadas de productos
- Análisis de tendencias del mercado
- Recomendaciones basadas en el giro de la empresa
- Keywords optimizadas para búsqueda

### Interfaz de Usuario
- Diseño responsive
- Tema oscuro/claro
- Navegación intuitiva
- Formularios y tablas modernos
- Modales interactivos

## Requisitos previos

- Python 3.10+
- Node.js 18+
- PostgreSQL
- (Opcional) Cuenta y API Key de OpenAI para recomendación IA

## Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone <repo-url>
cd zeiko-inventory-dashboard
```

### 2. Backend (Django)

#### a) Instala dependencias

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

#### b) Configura la base de datos y variables de entorno

Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```
DJANGO_SECRET_KEY=tu_clave_secreta
DB_NAME=zeiko_inventory
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
# Para recomendación IA:
OPENAI_API_KEY=sk-...tu_api_key...
```

#### c) Aplica migraciones y crea superusuario

```bash
python manage.py migrate
python manage.py createsuperuser
```

#### d) Ejecuta el backend

```bash
python manage.py runserver
```

El backend estará disponible en [http://localhost:8000](http://localhost:8000)

### 3. Frontend (React)

#### a) Instala dependencias

```bash
cd ../frontend
npm install
```

#### b) Configura variables de entorno

Crea un archivo `.env` en la carpeta `frontend`:

```
VITE_API_URL=http://localhost:8000
```

#### c) Ejecuta el frontend

```bash
npm run dev
```

El frontend estará disponible en [http://localhost:5173](http://localhost:5173)

## Estructura del Proyecto

```
zeiko-inventory-dashboard/
├── backend/
│   ├── .venv/
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## Funcionalidades Detalladas

### Dashboard
- Vista general de métricas importantes
- Gráficos de tendencias
- Alertas de stock bajo
- Productos más vendidos

### Gestión de Productos
- Creación y edición de productos
- Categorización
- Control de stock
- Historial de movimientos

### Recomendación IA
1. Accede a la sección de productos
2. Haz clic en "Recomendación de producto tendencia con IA"
3. Ingresa el giro de tu empresa
4. Recibe recomendaciones personalizadas con:
   - Productos sugeridos
   - Análisis de mercado
   - Keywords optimizadas
   - Razones de la recomendación

## Notas de Seguridad

- Las variables de entorno nunca deben subirse al repositorio
- Los entornos virtuales (.venv) están excluidos del control de versiones
- Las claves API deben mantenerse seguras
- Se recomienda usar HTTPS en producción

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

MIT

