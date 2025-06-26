import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class Utils {
    static passwordEncrypt = (password: string) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    static passwordDecrypt = (password: string, hash: string) => {
        return bcrypt.compareSync(password, hash)
    };

    static generateToken = (user: any) => {
        const secret = process.env.JWT_SECRET || 'secret'
        const token = jwt.sign({ user }, secret, { expiresIn: '1h' })
        return token
    }

    static validateToken = (token: string) => {
        const secret = process.env.JWT_SECRET || 'secret'
        const decoded = jwt.verify(token, secret)
        return decoded
    }
}