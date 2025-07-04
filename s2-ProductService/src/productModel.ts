import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './database'
import { IProduct } from './productInterface'

type ProductCreationAttributes = Optional<IProduct, 'id' | 'createdAt' | 'updatedAt'>

export class Product extends Model<IProduct, ProductCreationAttributes> implements IProduct {
    public id!: number
    public name!: string
    public description!: string
    public price!: number
    public stock!: number

    // timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        freezeTableName: true,
        timestamps: true,
    }
)
