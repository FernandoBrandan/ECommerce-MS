//  CREATE TABLE orders(
//      order_id VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
//      user_id VARCHAR(36) NOT NULL,
//      email VARCHAR(255) NOT NULL,
//      phone_number VARCHAR(20) NOT NULL,
//      total_amount DECIMAL(10, 2) NOT NULL,
//      status ENUM(
//          'created',
//          'payment_pending',
//          'payment_processing',
//          'paid',
//          'shipped',
//          'delivered',
//          'cancelled',
//          'payment_failed'
//      ) NOT NULL DEFAULT 'created',
//      cancellation_reason ENUM('not_paid', 'refund_processed', 'out_of_stock') NULL,
//      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//  )

// Tabla orders:
// status con ENUM que cubre todos los estados del flujo
// cancellation_reason para diferenciar tipos de cancelación
// Campos de timestamp para seguimiento temporal
// Eliminados campos de pago(ahora en tabla payments)

export interface IOrder {
    orderId?: string
    userId: string
    email: string
    phoneNumber: string
    totalAmount: number
    status?: string
    cancellationReason?: string
    createdAt?: Date
    updatedAt?: Date
}

// CREATE TABLE order_details(
//     detail_id INT AUTO_INCREMENT PRIMARY KEY,
//     order_id VARCHAR(36) NOT NULL,
//     item_id VARCHAR(36) NOT NULL,
//     price DECIMAL(10, 2) NOT NULL,
//     quantity INT NOT NULL DEFAULT 1,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY(order_id) REFERENCES orders(order_id) ON DELETE CASCADE
// )

// Tabla order_details:
// Relación 1:N con órdenes
// Almacena items individuales de cada orden
// Precio y cantidad por item

export interface IOrderDetail {
    detailId?: number
    orderId: string
    itemId: string
    name: string
    price: number
    quantity: number
    createdAt?: Date
    updatedAt?: Date
}


//  Tabla para historial de estados (opcional pero recomendado)
// CREATE TABLE order_status_history (
//     history_id INT AUTO_INCREMENT PRIMARY KEY,
//     order_id VARCHAR(36) NOT NULL,
//     old_status VARCHAR(50) NOT NULL,
//     new_status VARCHAR(50) NOT NULL,
//     changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     notes TEXT NULL,
//     FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
// );
//  Tabla order_status_history (opcional):
//  Auditoría de cambios de estado
//  Registra transiciones entre estados
//  Útil para debugging y análisis

