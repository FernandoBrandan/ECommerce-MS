stateDiagram-v2
[*] --> Orden_Creada
state "Orden Creada" as Orden_Creada
state "Pendiente de Pago" as Pendiente_Pago
state "Pago Procesándose" as Pago_Procesandose
state "Pagado - Preparando Envío" as Pagado_Preparando
state "Enviado" as Enviado
state "Entregado" as Entregado
state "Cancelado" as Cancelado {
state "No pagado" as No_Pagado
state "Reembolso procesado" as Reembolso
state "Falta de stock" as Stock
}
state "Pago Fallido" as Pago_Fallido

    Orden_Creada --> Pendiente_Pago : Se genera preference de MP
    Pendiente_Pago --> Pago_Procesandose : Usuario completa pago
    Pago_Procesandose --> Pagado_Preparando : Pago confirmado (5-15 min)
    Pago_Procesandose --> Pago_Fallido : Pago rechazado
    Pagado_Preparando --> Enviado : Paquete despachado (1-3 días)
    Enviado --> Entregado : Paquete recibido

    %% Transiciones de cancelación
    Pendiente_Pago --> No_Pagado : Cancelación usuario
    Pagado_Preparando --> Reembolso : Cancelación con reembolso
    Pagado_Preparando --> Stock : Falta de stock

    %% Transiciones de pago fallido
    Pago_Fallido --> Pendiente_Pago : Reintentar pago
    Pago_Fallido --> Pendiente_Pago : Cambiar método de pago

    %% Finalización del flujo
    Entregado --> [*]
    Cancelado --> [*]

```

```
