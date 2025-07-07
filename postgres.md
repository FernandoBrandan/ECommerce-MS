1 docker exec -it postgres psql -U postgres -d postgres_ems

2. Ver las tablas existentes
   \dt

3. Ver columnas de una tabla (por ejemplo products)
   \d products

4. Consultar datos
   SELECT \* FROM products;

5. Ver otras bases de datos
   \l

select c.id, c.user_id, c.total_price, cp.id, cp.product_id, cp.price, cp.quantity, cp.cart_id from carts as c inner join cart_products as cp on c.id = cp.cart_id;

TRUNCATE TABLE cart_products, carts, products RESTART IDENTITY CASCADE;
TRUNCATE TABLE cart_products, carts RESTART IDENTITY CASCADE;

INSERT INTO products (id, name, description, price, stock, "createdAt", "updatedAt") VALUES
(6, 'Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', 199.50, 30, NOW(), NOW()),
(7, 'Monitor 24"', 'Monitor LED Full HD de 24 pulgadas con entrada HDMI', 899, 20, NOW(), NOW()),
(8, 'Webcam HD', 'Cámara web 1080p con micrófono incorporado', 249, 50, NOW(), NOW()),
(9, 'Mousepad XL', 'Alfombrilla extendida para teclado y mouse, base antideslizante', 99, 100, NOW(), NOW()),
(10, 'Soporte Notebook', 'Soporte ajustable para notebook hasta 17 pulgadas', 299, 25, NOW(), NOW()),
(11, 'SSD 1TB', 'Disco sólido interno de 1TB SATA III', 999, 15, NOW(), NOW()),
(12, 'Cargador USB-C', 'Cargador rápido USB-C 65W compatible con notebooks y celulares', 320, 40, NOW(), NOW()),
(13, 'Gabinete ATX', 'Gabinete Mid Tower con ventiladores RGB y lateral de vidrio', 899, 10, NOW(), NOW()),
(14, 'Fuente 600W', 'Fuente de poder 600W certificada 80 Plus Bronze', 580, 12, NOW(), NOW()),
(15, 'Placa de video RTX 4060', 'NVIDIA GeForce RTX 4060 8GB GDDR6', 2499, 5, NOW(), NOW());
