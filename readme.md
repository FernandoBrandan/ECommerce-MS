# Escalable E-Commerce

Arquitectura de Microservicios con API Gateway.
Los servicios se comunican entre sí de forma directa y síncrona (por HTTP).

## Stack

- Node.js - Express.js - TypeScript.
- PostgreSQL.
- Nginx.
- Docker.
- MercadoPago API.
- Nodemailer, Twilio.

# Servicios y características

- Nginx: Servidor de balanceo de carga
- User service: Registro de usuarios, autenticación, gestión de perfiles, permisos.
- Product service: Gestión de productos, categorías, inventario.
- Shopping cart service: Gestión del carrito de compras, crud de productos, actualizacion de cantidad.
- Order service: Gestión de pedidos, carrito de compras, que incluyen requisitos de pedidos, monitoreo de estado de pedido e historial de pedidos de gestión.
- Payment service: Integración con MercadoPago para procesar pagos.
- Notification service: Envío de notificaciones por correo electrónico y SMS. Nodemailer, Twilio.

# Arquitectura

- Arquitectura de microservicios:
  Cada servicio es una base de código independiente, con su propia base de datos.
- API Gateway & Load Balancing:
  Nginx se utiliza como API gateway para dirigir las solicitudes al servicio adecuado y como Load Balancer para distribuir la carga entre varias instancias del mismo servicio.
- Docker:
  Se utiliza para ejecutar cada servicio de forma aislada, lo que facilita el despliegue y la escalabilidad de los servicios.
- Base de datos:
  PostgreSQL se utiliza como sistema de base de datos para todos los servicios, ofreciendo integridad transaccional, consultas SQL potentes y un diseño robusto.
  Para interactuar con PostgreSQL, se utiliza un ORM como Sequelize, lo que facilita la definición de modelos y el acceso a los datos.
- Autenticación y Autorización:
  JWT se utiliza para la autenticación y argon2 se utiliza para hash de contraseña.

## Futuro

- Despliegue:
  Kubernetes se utiliza para desplegar y gestionar los servicios en un entorno de producción, proporcionando escalabilidad, tolerancia a fallos y capacidades de autorreparación.
- Canalización CI/CD:
  Github Actions se utiliza para CI/CD para automatizar el proceso de despliegue, incluyendo la construcción, prueba y despliegue de los servicios.
- Github Actions (CI/CD) Requirements
- - Add DOCKER_USERNAME & DOCKER_PASSWORD to github secrets to push the image to docker hub.
