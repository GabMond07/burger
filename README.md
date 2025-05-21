# Burguer Queen

Aplicación móvil tipo POS (Point of Sale) para restaurantes, desarrollada con Ionic y Angular. Permite tomar órdenes, gestionar productos y conectar con un backend.

## Tecnologías empleadas:

- Ionic Framework
- Angular
- Firebase
- Docker (archivo docker-compose incluido)
- Capacitor
- TypeScript

### Instrucciones de instalación y ejecución

1. **Clonar el repositorio**:

git clone <URL-del-repositorio>
cd pf2_burguer_queen-master

3. Instalar dependencias:

npm install

4. Configurar Firebase:

Crea un proyecto en Firebase.
Asegúrate de configurar los archivos dentro de .firebase/.

5. Ejecutar localmente:

ionic serve


6. Levantar el entorno con Docker (si aplica):

docker-compose up --build

7. Ejecutar en Android:

ionic capacitor add android
ionic capacitor open android
