import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './database'
import { IUser } from './userInterface'

type UserCreationAttributes = Optional<IUser, 'id' | 'createdAt' | 'updatedAt'>

export class User extends Model<IUser, UserCreationAttributes> implements IUser {
    public id!: number
    public name!: string
    public email!: string
    public phoneNumber!: string
    public password!: string

    // timestamps
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

User.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users', // minúsculas y singular o plural, según prefieras
        freezeTableName: true, // evita pluralización automática
        timestamps: true, // Sequelize crea createdAt y updatedAt automáticamente
    }
)
