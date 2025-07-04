import { Sequelize } from 'sequelize'

const POSTGRE_URI = process.env.POSTGRE_URI || 'postgres://postgres:postgres@localhost:5432/postgres_ems'
export const sequelize = new Sequelize(POSTGRE_URI)
//export const sequelize = new Sequelize('e-ms', 'postgres', 'postgres', { host: 'localhost', dialect: 'postgres' })

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('Conexión a la base de datos establecida')
        sequelize.sync({ alter: true }).then(() => console.log('Tablas sincronizadas'))
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error)
    }
}

connectToDatabase()
export default connectToDatabase