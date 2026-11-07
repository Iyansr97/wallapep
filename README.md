# Wallapep

Wallapep es una web de compraventa de productos de segunda mano. Es un proyecto universitario, desarrollado como práctica de la asignatura **Diseño y Programación de Interfaces de Usuario** de un máster de la Universidad de Oviedo.

El objetivo de la práctica era construir el frontend de la aplicación sobre un backend proporcionado por la asignatura, y aplicar pautas de diseño y usabilidad: jerarquía visual, retroalimentación al usuario, validación de formularios, tablas adaptables, filtros combinables y navegación clara.

## Funcionalidades

- **Registro en tres pasos** con todos los datos del usuario y validación del documento de identidad (DNI, NIE o pasaporte).
- **Página principal** con accesos directos y las 7 categorías de productos, cada una con su icono, color y número de productos.
- **Listado de productos** con filtros combinables por título, categoría y precio, contador de resultados en cada opción, ordenación y marca de productos visitados recientemente.
- **Compra de productos** desde el listado o el detalle, eligiendo la tarjeta de pago, con confirmación final.
- **Venta de productos** con imagen, y gestión de los propios en una tabla: edición del precio en la propia tabla, selección y borrado múltiple con confirmación, y filtros.
- **Historial de compras y ventas** con resumen de gastos e ingresos, filtros y vista de detalle.
- **Perfiles de usuario** con datos públicos, reputación (número de ventas y compras) y pestañas filtrables de productos, ventas y compras.
- **Interfaz adaptable**: las tablas muestran las columnas que caben y el resto se consulta con un botón **More**, sin scroll horizontal.

## Tecnologías

- [Next.js](https://nextjs.org/) 16 (Pages Router) y React 19
- [Ant Design](https://ant.design/) 5 como librería de componentes
- [Day.js](https://day.js.org/) para las fechas

## Estructura del repositorio

| Carpeta | Contenido |
|---|---|
| `wallapep/` | Código de la aplicación web |
| `base-de-datos/` | Script SQL con datos de prueba, imágenes de los productos y sus créditos |
| `guia/` | Guía de ayuda para usar la web |

## Puesta en marcha

La aplicación necesita el backend de la asignatura (Express y MySQL, puerto 4000), que no se incluye en este repositorio. El backend se conecta a la base de datos `products` de MySQL o MariaDB con el usuario `root` y la contraseña `prueba`.

1. Importar la base de datos. El script crea la base de datos `products`; si ya existe una con ese nombre, la sustituye:

   ```bash
   mysql -u root -p < base-de-datos/products.sql
   ```

2. Copiar el contenido de `base-de-datos/images` en la carpeta `public/images` del backend y arrancarlo.

3. Configurar la dirección del backend en la aplicación, copiando el fichero de ejemplo:

   ```bash
   cd wallapep
   cp .env.example .env.development.local
   ```

4. Instalar las dependencias y arrancar la aplicación:

   ```bash
   npm install
   npm run dev
   ```

5. Abrir http://localhost:3000.

## Usuarios de prueba

| Email | Contraseña |
|---|---|
| `iyan@iyan.iyan` | `iyan` |
| `lucia.fernandez@example.com` | `1234` |
| `carlos.martinez@example.com` | `1234` |
| `mariajose.garciadelafuente@example.com` | `1234` |
| `pablo.menendez@example.com` | `1234` |
| `ana.lopez@example.com` | `1234` |

El primer usuario es el que tiene más datos: productos en venta, ventas, compras y varias tarjetas. Los datos son ficticios.

## Créditos

Las imágenes de los productos proceden de Wikimedia Commons. Sus autores y licencias están en [`base-de-datos/CREDITOS-IMAGENES.md`](base-de-datos/CREDITOS-IMAGENES.md).
