import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './database'
import { IPayment } from './paymentInterface'

type PaymentCreationAttributes = Optional<IPayment, 'id' | 'createdAt' | 'updatedAt'>

export class Payment extends Model<IPayment, PaymentCreationAttributes> implements IPayment {
    public id!: string
    public payment_id!: string
    public status!: string
    public preference_id!: string
    public external_reference!: string
    public init_point_url!: string
    public transaction_amount!: number
    public payment_method_id!: string

    // timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Payment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        payment_id: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        preference_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        external_reference: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        init_point_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        transaction_amount: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        payment_method_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Payment',
        tableName: 'payments',
        freezeTableName: true,
        timestamps: true,
    }
)
