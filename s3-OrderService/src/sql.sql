

CREATE TABLE payments (
    payment_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    mp_payment_id VARCHAR(255) NULL,
    status ENUM(
        'pending',
        'approved',
        'in_process',
        'rejected',
        'cancelled',
        'refunded'
    ) NOT NULL DEFAULT 'pending',
    preference_id VARCHAR(255) NOT NULL,
    transaction_amount DECIMAL(10,2) NOT NULL,
    payment_method_id VARCHAR(50) NULL,
    payment_link VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Tabla payments:
-- Relación 1:1 con órdenes mediante order_id
-- preference_id para seguimiento de MercadoPago
-- payment_link almacena el enlace de pago generado
-- status con estados específicos de pagos
-- Mantiene todos los campos relacionados con transacciones

