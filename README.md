# Ejercicios 1, 2 y 6: API, aplicación web y MongoDB

Este proyecto académico contiene una API REST en Express, una página web estática y conexión opcional a MongoDB Atlas.

## Requisitos

- Node.js LTS y npm
- Cuenta de GitHub
- Cuenta de Render
- Cuenta de MongoDB Atlas

## A. Configurar MongoDB Atlas (ejercicio 6)

1. Crea una cuenta en https://www.mongodb.com/atlas/database.
2. Crea un deployment/cluster gratuito disponible en tu cuenta.
3. Crea un usuario de base de datos con contraseña.
4. En Network Access, permite la IP desde la que te conectarás. Para una práctica, puedes configurar temporalmente `0.0.0.0/0`, pero es más seguro limitar el acceso a las IP necesarias y quitar la regla amplia al terminar.
5. En tu cluster, pulsa Connect > Drivers > Node.js y copia la URI.
6. En `api`, duplica `.env.example` con el nombre `.env`. Pega la URI en `MONGODB_URI`, reemplaza el usuario/contraseña de ejemplo y configura `DB_NAME=ejercicios_db`.
7. No subas `.env` a GitHub. El archivo `.gitignore` ya lo excluye.

## B. Ejecutar la API localmente (ejercicio 1)

Desde una terminal, entra en la carpeta `api` y ejecuta:

```bash
npm install
npm start
```

Abre `http://localhost:3000/` y luego `http://localhost:3000/api/health`.
La segunda dirección debería mostrar `ok: true` y `mongodb: "conectado"` si Atlas está bien configurado.

## C. Probar la web localmente (ejercicio 2)

Abre `web/app.js` y confirma que `API_URL` sea `http://localhost:3000`.
Abre `web/index.html` en un navegador o usa la extensión Live Server de Visual Studio Code. Agrega un registro y comprueba que aparece en la lista y se guarda en Atlas.

## D. Subir a GitHub

1. Crea un repositorio nuevo en GitHub.
2. Sube las carpetas `api` y `web`, junto con este README.
3. Confirma que `api/.env` no esté en los archivos a subir.

## E. Desplegar la API en Render (ejercicio 1)

1. En https://render.com, selecciona New > Web Service.
2. Conecta el repositorio de GitHub.
3. Si pregunta por Root Directory, escribe `api`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. En Environment Variables agrega:
   - `MONGODB_URI`: tu URI de Atlas real
   - `DB_NAME`: `ejercicios_db`
   - `WEB_ORIGIN`: la URL pública de tu web en Render (se configura después)
7. Crea el servicio y espera a que el despliegue termine.
8. Prueba `https://TU-API.onrender.com/api/health`. No entregues la URL hasta comprobar que `ok` es `true`.

## F. Desplegar la web en Render (ejercicio 2)

1. En Render, selecciona New > Static Site y conecta el mismo repositorio.
2. Root Directory: `web`.
3. Build Command: déjalo vacío si Render lo permite.
4. Publish Directory: `.`.
5. Crea el sitio y copia su URL pública.
6. Edita `web/app.js`: reemplaza `http://localhost:3000` por la URL real de la API, sin `/` al final.
7. Sube el cambio a GitHub; Render debería volver a desplegar la web.
8. En el servicio API, actualiza `WEB_ORIGIN` con la URL pública de la web y guarda el cambio para desplegar de nuevo.

## Endpoints

- `GET /`: información básica de la API
- `GET /api/health`: estado de API y MongoDB
- `GET /api/items`: lista los registros
- `POST /api/items`: guarda un registro; JSON de ejemplo: `{"title":"Mi actividad"}`

## Evidencias para el informe

1. Atlas mostrando el deployment y la base de datos `ejercicios_db` después de insertar un registro.
2. Navegador mostrando `/api/health` con MongoDB conectado.
3. Render mostrando el despliegue de la API como exitoso.
4. Render mostrando el Static Site publicado.
5. Página web pública con un registro guardado y visible.
6. Explica que la API recibe las solicitudes, MongoDB Atlas almacena los datos y la web consume la API.

No incluyas contraseñas, cadenas de conexión ni capturas que las revelen en el informe.
