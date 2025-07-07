import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './database'
import { IOrder, IOrderDetail } from './orderInterface'

type OrderCreationAttributes = Optional<IOrder, 'orderId' | 'status' | 'cancellationReason' | 'createdAt' | 'updatedAt'>

export class Order extends Model<IOrder, OrderCreationAttributes> implements IOrder {
    public orderId!: string
    public userId!: string
    public email!: string
    public phoneNumber!: string
    public totalAmount!: number
    public status!: string
    public cancellationReason?: string

    // timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Order.init(
    {
        orderId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true,
            field: 'order_id',
        },
        userId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            field: 'user_id',
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: 'phone_number',
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'total_amount',
        },
        status: {
            type: DataTypes.ENUM(
                'created',
                'payment_pending',
                'payment_processing',
                'paid',
                'shipped',
                'delivered',
                'cancelled',
                'payment_failed'
            ),
            allowNull: false,
            defaultValue: 'created',
        },
        cancellationReason: {
            type: DataTypes.ENUM('not_paid', 'refund_processed', 'out_of_stock'),
            allowNull: true,
            field: 'cancellation_reason',
        },
    },
    {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        freezeTableName: true,
        timestamps: true,
        underscored: true,
    }
)


type OrderDetailCreationAttributes = Optional<IOrderDetail, 'detailId' | 'createdAt' | 'updatedAt'>

export class OrderDetail extends Model<IOrderDetail, OrderDetailCreationAttributes> implements IOrderDetail {
    public detailId!: number
    public orderId!: string
    public itemId!: string
    public name!: string
    public price!: number
    public quantity!: number
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

OrderDetail.init(
    {
        detailId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'detail_id',
        },
        orderId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            field: 'order_id',
        },
        itemId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            field: 'item_id',
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'item_name',
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        sequelize,
        modelName: 'OrderDetail',
        tableName: 'order_details',
        freezeTableName: true,
        timestamps: true,
        underscored: true,
    }
)


Order.hasMany(OrderDetail, {
    sourceKey: 'orderId',
    foreignKey: 'orderId',
    as: 'details',
    onDelete: 'CASCADE',
})

OrderDetail.belongsTo(Order, {
    targetKey: 'orderId',
    foreignKey: 'orderId',
    as: 'order',
})
