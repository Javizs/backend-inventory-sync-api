# Arquitectura del proyecto

## Tipo de arquitectura

El proyecto utiliza una arquitectura por capas:

```text
Route → Controller → Service → Base de datos o API externa
```

Está organizado por recursos: productos, clientes y pedidos.

No existe actualmente una capa `repository` independiente, por lo que los `services` también realizan el acceso a datos.

## Flujo general de una petición

1. La `route` recibe la petición y la dirige al `controller` correspondiente.
2. El `controller` extrae y valida los datos básicos de la petición.
3. El `service` aplica las reglas de negocio y accede a los datos.
4. El `controller` construye y devuelve la respuesta HTTP en formato JSON.
5. Si ocurre un error, se envía mediante `next(error)` al middleware centralizado.

```text
Route
→ Controller
→ Service
→ MySQL o API externa
→ Controller
→ Respuesta HTTP/JSON

Error
→ next(error)
→ errorHandler
→ Respuesta de error JSON
```

## Routes

Las `routes` relacionan cada método HTTP y URL con un `controller`.

Su responsabilidad es definir los endpoints y dirigir la petición. No contienen lógica de negocio ni realizan consultas a la base de datos.

## Controllers

Los `controllers` trabajan directamente con `req`, `res` y `next`.

Sus responsabilidades principales son:

- Extraer datos desde `req.params`, `req.query` o `req.body`.
- Realizar validaciones básicas de entrada.
- Llamar al `service` correspondiente.
- Construir la respuesta HTTP.
- Enviar los errores al middleware mediante `next(error)`.

## Services

Los `services` contienen la lógica de la aplicación.

Sus responsabilidades son:

- Aplicar reglas de negocio.
- Consultar MySQL o una API externa.
- Validar la existencia o el estado de los datos.
- Ejecutar operaciones complejas, como transacciones.
- Lanzar errores cuando una operación no puede completarse.

Los `services` no trabajan directamente con `req`, `res` ni construyen respuestas HTTP.

## Repositories

No existe actualmente una capa `repository` independiente.

Las consultas SQL se encuentran dentro de los `services`, que combinan la lógica de negocio y el acceso a datos.

Esta estructura es válida para el tamaño actual del proyecto, aunque una posible mejora futura sería separar las consultas SQL en una capa `repository`.

## Middlewares

El proyecto utiliza varios middlewares:

- `express.json()` interpreta el cuerpo de las peticiones en formato JSON y lo deja disponible en `req.body`.
- `notFoundHandler` gestiona las peticiones realizadas a rutas que no existen.
- `errorHandler` procesa los errores enviados mediante `next(error)` y devuelve una respuesta JSON homogénea.

## Manejo de errores

Los errores se envían desde los `controllers` o `services` mediante:

```js
next(error);
```

Después son procesados por `errorHandler`, que genera una respuesta similar a:

```json
{
  "ok": false,
  "message": "Descripción del error"
}
```

Esto evita repetir la lógica de respuesta de errores en cada endpoint y mantiene un formato consistente en toda la API.

## Ejemplo completo de un endpoint

El flujo de `POST /api/orders` es:

```text
app.js
→ orders.routes.js
→ orders.controllers.js
→ orders.services.js
→ MySQL
```

La `route` relaciona el endpoint con el `controller`.

El `controller` obtiene los datos del pedido desde `req.body`, realiza las validaciones básicas y llama al `service`.

El `service`:

1. Comprueba que el cliente existe y está activo.
2. Comprueba que los productos existen.
3. Verifica que hay suficiente stock.
4. Calcula el total del pedido.
5. Crea el pedido y sus líneas asociadas.
6. Actualiza el stock.
7. Ejecuta todas las operaciones dentro de una transacción SQL.

Si alguna operación falla, se ejecuta `rollback` para deshacer los cambios.

Si todas las operaciones terminan correctamente, se ejecuta `commit` y el `controller` devuelve la respuesta JSON.

## Decisiones técnicas y posibles mejoras

El proyecto utiliza:

- Consultas SQL parametrizadas.
- Pool de conexiones.
- Transacciones SQL.
- Separación entre `routes`, `controllers` y `services`.
- Manejo centralizado de errores.
- Integración con una API externa.

