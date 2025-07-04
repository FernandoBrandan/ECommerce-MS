import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './database'
import { ICart, ICartItem } from './cartInterface'

type CartCreationAttributes = Optional<ICart, 'id' | 'createdAt' | 'updatedAt'>
export class Cart extends Model<ICart, CartCreationAttributes> implements ICart {
    public id!: number
    public userId!: number
    public total_price!: number

    // timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

type CartProductCreationAttributes = Optional<ICartItem, 'id' | 'createdAt' | 'updatedAt'>
export class CartItem extends Model<ICartItem, CartProductCreationAttributes> implements ICartItem {
    public id!: number
    public productId!: number
    public name!: string
    public price!: number
    public quantity!: number
    public cartId!: number

    // timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Cart.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
        total_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Cart',
        tableName: 'carts',
        freezeTableName: true,
        timestamps: true,
        underscored: true,
    }
)

// Inicialización del modelo CartProduct
CartItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: true, // Cambiar a false, ya que price es obligatorio, anda a saber en que momento buscarlo si desde el fron o a la api
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true, // Cambiar a false, ya que quantity es obligatorio, anda a saber en que momento buscarlo si desde el fron o a la api
            defaultValue: 1, // al comentario de arriba no le veo sentido porque si no se envia quantity, no se puede crear el item
        },
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'cart_id',
        }
    },
    {
        sequelize,
        modelName: 'CartProduct',
        tableName: 'cart_products',
        freezeTableName: true,
        timestamps: true,
        underscored: true,
    }
)

Cart.hasMany(CartItem, {
    sourceKey: 'id',
    foreignKey: 'CartId',
    as: 'items'
})

CartItem.belongsTo(Cart, {
    targetKey: 'id',
    foreignKey: 'CartId',
    as: 'cart'
})
